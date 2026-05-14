import { createServerFn } from "@tanstack/react-start";

export type ScannedItem = {
  emoji: string;
  name: string;
  qty: number;
  price: number;
};

export type ScanResult = {
  items: ScannedItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  merchant?: string;
};

export const scanReceipt = createServerFn({ method: "POST" })
  .inputValidator((input: { imageDataUrl: string }) => {
    if (!input?.imageDataUrl?.startsWith("data:image/")) {
      throw new Error("imageDataUrl must be a data:image/* URL");
    }
    if (input.imageDataUrl.length > 8_000_000) {
      throw new Error("Image too large (max ~6MB)");
    }
    return input;
  })
  .handler(async ({ data }): Promise<ScanResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You extract line items from restaurant receipts. Return ONLY structured data via the tool. Choose a fitting food emoji per item. Quantity defaults to 1 if unclear. Prices are numbers in the receipt's currency (no symbols).",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Extract every ordered item from this receipt." },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_receipt",
              description: "Return parsed receipt items.",
              parameters: {
                type: "object",
                properties: {
                  merchant: { type: "string" },
                  subtotal: { type: "number" },
                  tax: { type: "number" },
                  total: { type: "number" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        emoji: { type: "string", description: "Single food emoji" },
                        name: { type: "string" },
                        qty: { type: "number" },
                        price: { type: "number", description: "Total price for the line (qty * unit)" },
                      },
                      required: ["emoji", "name", "qty", "price"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["items"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_receipt" } },
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      if (resp.status === 429) throw new Error("Rate limit hit. Try again in a minute.");
      if (resp.status === 402) throw new Error("AI credits exhausted. Add funds in Settings.");
      throw new Error(`AI gateway ${resp.status}: ${body.slice(0, 200)}`);
    }

    const json = await resp.json();
    const call = json?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("AI returned no items");
    const args = JSON.parse(call.function.arguments);
    return {
      merchant: args.merchant,
      subtotal: args.subtotal,
      tax: args.tax,
      total: args.total,
      items: (args.items ?? []).map((i: ScannedItem) => ({
        emoji: i.emoji || "🍽",
        name: i.name,
        qty: Number(i.qty) || 1,
        price: Number(i.price) || 0,
      })),
    };
  });
