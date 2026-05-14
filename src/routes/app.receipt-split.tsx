import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/receipt-split")({
  component: ReceiptSplit,
});

type Member = { id: string; name: string; initial: string; ring: string };

const members: Member[] = [
  { id: "A", name: "Arjun", initial: "A", ring: "border-primary text-primary bg-primary/15" },
  { id: "R", name: "Rohan", initial: "R", ring: "border-secondary text-secondary bg-secondary/15" },
  { id: "S", name: "Sneha", initial: "S", ring: "border-success text-success bg-success/15" },
  { id: "P", name: "Priya", initial: "P", ring: "border-accent text-accent bg-accent/15" },
  { id: "K", name: "Karan", initial: "K", ring: "border-destructive text-destructive bg-destructive/15" },
];

type Item = { id: string; emoji: string; name: string; qty: number; price: number };

const DEFAULT_ITEMS: Item[] = [
  { id: "noodles", emoji: "🍜", name: "Noodles", qty: 1, price: 280 },
  { id: "lime", emoji: "🥤", name: "Fresh Lime Soda", qty: 2, price: 180 },
  { id: "butter", emoji: "🍗", name: "Butter Chicken", qty: 1, price: 450 },
  { id: "rice", emoji: "🍚", name: "Steamed Rice", qty: 2, price: 160 },
  { id: "icecream", emoji: "🍦", name: "Ice Cream", qty: 1, price: 120 },
];

function ReceiptSplit() {
  const [items, setItems] = useState<Item[]>(DEFAULT_ITEMS);
  const [merchant, setMerchant] = useState<string | null>(null);
  const [aiScanned, setAiScanned] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("chipin:scanned-receipt");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.items) && parsed.items.length) {
        setItems(
          parsed.items.map((i: { emoji: string; name: string; qty: number; price: number }, idx: number) => ({
            id: `${idx}-${i.name}`,
            emoji: i.emoji || "🍽",
            name: i.name,
            qty: i.qty || 1,
            price: i.price || 0,
          })),
        );
        setMerchant(parsed.merchant ?? null);
        setAiScanned(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const SUBTOTAL = useMemo(() => items.reduce((s, i) => s + i.price, 0), [items]);
  const GST = Math.round(SUBTOTAL * 0.18);
  const SERVICE = Math.round(SUBTOTAL * 0.05);
  const TOTAL = SUBTOTAL + GST + SERVICE;
  const TAX_MULT = SUBTOTAL > 0 ? TOTAL / SUBTOTAL : 1;

  return <ReceiptSplitInner items={items} members={members} merchant={merchant} aiScanned={aiScanned} SUBTOTAL={SUBTOTAL} GST={GST} SERVICE={SERVICE} TOTAL={TOTAL} TAX_MULT={TAX_MULT} />;
}

function ReceiptSplitInner({
  items, members, merchant, aiScanned, SUBTOTAL, GST, SERVICE, TOTAL, TAX_MULT,
}: {
  items: Item[];
  members: Member[];
  merchant: string | null;
  aiScanned: boolean;
  SUBTOTAL: number;
  GST: number;
  SERVICE: number;
  TOTAL: number;
  TAX_MULT: number;
}) {
  const [claims, setClaims] = useState<Record<string, string[]>>({});

  const toggleClaim = (itemId: string, memberId: string) => {
    setClaims((prev) => {
      const cur = prev[itemId] ?? [];
      const next = cur.includes(memberId)
        ? cur.filter((m) => m !== memberId)
        : [...cur, memberId];
      return { ...prev, [itemId]: next };
    });
  };

  const unclaimedCount = items.filter((i) => !(claims[i.id]?.length)).length;
  const allClaimed = unclaimedCount === 0;

  const tally = useMemo(() => {
    const map: Record<string, number> = {};
    members.forEach((m) => (map[m.id] = 0));
    items.forEach((i) => {
      const c = claims[i.id] ?? [];
      if (!c.length) return;
      const perPerson = (i.price * TAX_MULT) / c.length;
      c.forEach((mid) => (map[mid] += perPerson));
    });
    return map;
  }, [claims]);

  const personItemCount = (mid: string) =>
    items.filter((i) => (claims[i.id] ?? []).includes(mid)).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">What did everyone order?</h1>
        <p className="text-sm text-muted-foreground">
          Tap items to claim — bill splits automatically
        </p>
      </header>

      <div className="space-y-3">
        {items.map((item) => {
          const claimed = claims[item.id] ?? [];
          const isClaimed = claimed.length > 0;
          return (
            <div
              key={item.id}
              className={`rounded-2xl p-[1.5px] transition-smooth ${
                isClaimed ? "bg-gradient-primary shadow-glow" : "bg-border"
              }`}
            >
              <div className={`rounded-[14px] p-4 ${isClaimed ? "bg-card-2" : "bg-card"}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">
                      {item.name}{" "}
                      <span className="text-xs text-muted-foreground">× {item.qty}</span>
                    </p>
                    {isClaimed ? (
                      <p className="text-xs text-success">
                        Claimed by {claimed.length} — ₹{(item.price / claimed.length).toFixed(0)} each
                      </p>
                    ) : (
                      <p className="text-xs text-accent">Unclaimed</p>
                    )}
                  </div>
                  <p className="font-bold text-foreground">₹{item.price}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {members.map((m) => {
                    const on = claimed.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        onClick={() => toggleClaim(item.id, m.id)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-smooth ${
                          on
                            ? `${m.ring} shadow-glow scale-110`
                            : "border-border bg-card text-muted-foreground hover:border-foreground/40"
                        }`}
                        aria-label={`${on ? "Unclaim" : "Claim"} for ${m.name}`}
                      >
                        {m.initial}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 text-sm">
        <Row label="Subtotal" value={`₹${SUBTOTAL.toLocaleString("en-IN")}`} />
        <Row label="GST 18%" value={`₹${GST.toLocaleString("en-IN")}`} />
        <Row label="Service 5%" value={`₹${SERVICE.toLocaleString("en-IN")}`} />
        <div className="mt-2 border-t border-border pt-2">
          <Row label="TOTAL" value={`₹${TOTAL.toLocaleString("en-IN")}`} bold />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Running Tally
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {members.map((m) => {
            const done = personItemCount(m.id) > 0 && allClaimed;
            return (
              <div
                key={m.id}
                className="flex items-center gap-2 rounded-xl border border-border bg-card p-3"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold ${m.ring}`}
                >
                  {m.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="truncate text-sm font-semibold text-foreground">{m.name}</p>
                    {done && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success text-[10px] font-bold text-background">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">₹{tally[m.id].toFixed(0)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {unclaimedCount > 0 && (
        <div className="rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm font-medium text-accent">
          ⚠ {unclaimedCount} item{unclaimedCount > 1 ? "s" : ""} unclaimed
        </div>
      )}

      <button
        disabled={!allClaimed}
        className={`w-full rounded-pill py-4 text-base font-bold transition-smooth ${
          allClaimed
            ? "bg-gradient-primary text-primary-foreground shadow-glow-lg hover:opacity-95"
            : "cursor-not-allowed bg-card-2 text-muted-foreground"
        }`}
      >
        Confirm Split
      </button>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      className={`flex justify-between py-1 ${
        bold ? "text-base font-bold text-foreground" : "text-muted-foreground"
      }`}
    >
      <span>{label}</span>
      <span className={bold ? "" : "text-foreground"}>{value}</span>
    </div>
  );
}
