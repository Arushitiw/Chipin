import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Camera, Search, Upload, Check, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { cn } from "@/lib/utils";
import { scanReceipt } from "@/lib/receipt-scan.functions";
import { toast } from "sonner";

type ExpenseSearch = { type?: string; name?: string };

export const Route = createFileRoute("/app/add-expense")({
  component: AddExpense,
  validateSearch: (s: Record<string, unknown>): ExpenseSearch => ({
    type: typeof s.type === "string" ? s.type : undefined,
    name: typeof s.name === "string" ? s.name : undefined,
  }),
});

const CURRENCIES = [
  { code: "INR", flag: "🇮🇳", name: "Indian Rupee", rate: 1 },
  { code: "USD", flag: "🇺🇸", name: "US Dollar", rate: 83.4 },
  { code: "EUR", flag: "🇪🇺", name: "Euro", rate: 90.1 },
  { code: "GBP", flag: "🇬🇧", name: "British Pound", rate: 105.6 },
  { code: "JPY", flag: "🇯🇵", name: "Japanese Yen", rate: 0.55 },
  { code: "IDR", flag: "🇮🇩", name: "Indonesian Rupiah", rate: 0.0053 },
  { code: "THB", flag: "🇹🇭", name: "Thai Baht", rate: 2.31 },
  { code: "AUD", flag: "🇦🇺", name: "Australian Dollar", rate: 55.2 },
  { code: "SGD", flag: "🇸🇬", name: "Singapore Dollar", rate: 61.8 },
  { code: "AED", flag: "🇦🇪", name: "UAE Dirham", rate: 22.7 },
  { code: "CHF", flag: "🇨🇭", name: "Swiss Franc", rate: 94.0 },
  { code: "CAD", flag: "🇨🇦", name: "Canadian Dollar", rate: 60.9 },
];

const CATEGORIES = [
  { id: "flight", icon: "✈", label: "Flight" },
  { id: "hotel", icon: "🏨", label: "Hotel" },
  { id: "food", icon: "🍽", label: "Food" },
  { id: "transport", icon: "🚗", label: "Transport" },
  { id: "activity", icon: "🏄", label: "Activity" },
  { id: "shopping", icon: "🛍", label: "Shopping" },
  { id: "entertainment", icon: "🎭", label: "Entertainment" },
  { id: "other", icon: "🔧", label: "Other" },
];

const MEMBERS = [
  { id: "arjun", name: "Arjun", initial: "A", color: "var(--primary)" },
  { id: "rohan", name: "Rohan", initial: "R", color: "var(--secondary)" },
  { id: "sneha", name: "Sneha", initial: "S", color: "var(--success)" },
  { id: "priya", name: "Priya", initial: "P", color: "var(--accent)" },
  { id: "karan", name: "Karan", initial: "K", color: "var(--muted-foreground)" },
];

function AddExpense() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const splitType = search.type;
  const splitName = search.name;
  const isBite = splitType === "bite";

  const visibleCategories = isBite
    ? CATEGORIES.filter((c) => c.id === "food")
    : CATEGORIES;

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(CURRENCIES[2]);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [search2, setSearch2] = useState("");
  const [category, setCategory] = useState(isBite ? "food" : "food");
  const [paidBy, setPaidBy] = useState("arjun");
  const [participants, setParticipants] = useState<Record<string, boolean>>({
    arjun: true,
    rohan: true,
    sneha: true,
    priya: false,
    karan: false,
  });
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scan = useServerFn(scanReceipt);

  const handleReceiptFile = async (file: File) => {
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      toast.error("Image too large — keep it under 6MB");
      return;
    }
    setScanning(true);
    try {
      const dataUrl: string = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = () => rej(r.error);
        r.readAsDataURL(file);
      });
      const result = await scan({ data: { imageDataUrl: dataUrl } });
      if (!result.items.length) {
        toast.error("No items found on the receipt");
        return;
      }
      sessionStorage.setItem(
        "chipin:scanned-receipt",
        JSON.stringify({ ...result, scannedAt: Date.now() }),
      );
      toast.success(`Found ${result.items.length} items — claim away!`);
      navigate({ to: "/app/receipt-split" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't scan receipt");
    } finally {
      setScanning(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };
    arjun: true,
    rohan: true,
    sneha: true,
    priya: false,
    karan: false,
  });

  const numAmount = parseFloat(amount) || 0;
  const inrAmount = Math.round(numAmount * currency.rate);
  const activeCount = Object.values(participants).filter(Boolean).length;
  const perPerson = activeCount > 0 ? Math.round(inrAmount / activeCount) : 0;

  const filteredCurrencies = useMemo(
    () =>
      CURRENCIES.filter(
        (c) =>
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <header className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-card">
        <div className="flex items-center gap-3">
          <Link
            to="/app/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card-2 text-foreground transition-smooth hover:bg-border"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold leading-tight">Add Expense</h1>
            <p className="text-sm text-muted-foreground">Bali 2025</p>
          </div>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow"
        >
          <Upload className="h-5 w-5" />
        </button>
      </header>

      {/* Expense Name */}
      <Section label="EXPENSE NAME">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Beach Club Dinner"
          maxLength={100}
          className="h-14 w-full rounded-xl border border-border bg-card-2 px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </Section>

      {/* Amount + Currency */}
      <Section label="AMOUNT">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setCurrencyOpen((v) => !v)}
            className="flex h-14 items-center gap-2 rounded-xl border border-border bg-card-2 px-3 font-semibold text-foreground transition-smooth hover:border-primary"
          >
            <span className="text-lg">{currency.flag}</span>
            <span className="text-sm">{currency.code}</span>
            <span className="text-xs text-muted-foreground">▾</span>
          </button>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="h-14 flex-1 rounded-xl border border-border bg-card-2 px-4 text-2xl font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        {currency.code !== "INR" && numAmount > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            = ₹{inrAmount.toLocaleString("en-IN")} at today's rate{" "}
            <span className="opacity-60">(locked at save)</span>
          </p>
        )}

        {currencyOpen && (
          <div className="mt-3 rounded-xl border border-border bg-card p-3 shadow-card">
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currencies"
                className="h-10 w-full rounded-lg border border-border bg-card-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="max-h-56 overflow-y-auto">
              {filteredCurrencies.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setCurrency(c);
                    setCurrencyOpen(false);
                    setSearch("");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-smooth hover:bg-card-2"
                >
                  <span className="text-lg">{c.flag}</span>
                  <span className="font-semibold">{c.code}</span>
                  <span className="text-sm text-muted-foreground">{c.name}</span>
                  {currency.code === c.code && (
                    <Check className="ml-auto h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Category */}
      <Section label="CATEGORY">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={cn(
                  "flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-smooth",
                  active
                    ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                    : "border-border bg-card-2 text-foreground hover:border-primary/50",
                )}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Paid By */}
      <Section label="PAID BY">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {MEMBERS.map((m) => {
            const selected = paidBy === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaidBy(m.id)}
                className="flex shrink-0 flex-col items-center gap-1.5"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full font-bold text-foreground transition-smooth",
                    selected
                      ? "shadow-glow ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "ring-1 ring-border",
                  )}
                  style={{
                    background: selected
                      ? "color-mix(in oklab, var(--primary) 25%, var(--card-2))"
                      : "var(--card-2)",
                    color: selected ? "var(--foreground)" : m.color,
                  }}
                >
                  {m.initial}
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    selected ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {m.name}
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Participants */}
      <Section
        label="WHO PARTICIPATED?"
        sublabel="Only selected members will split this cost"
      >
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {MEMBERS.map((m, i) => {
            const on = participants[m.id];
            return (
              <div
                key={m.id}
                className={cn(
                  "flex items-center justify-between px-4 py-3",
                  i !== MEMBERS.length - 1 && "border-b border-border",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-card-2 font-bold ring-1 ring-border"
                    style={{ color: m.color }}
                  >
                    {m.initial}
                  </div>
                  <span
                    className={cn(
                      "font-semibold",
                      on ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {m.name}
                  </span>
                </div>
                <Toggle
                  on={on}
                  onChange={() =>
                    setParticipants((p) => ({ ...p, [m.id]: !p[m.id] }))
                  }
                />
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm font-semibold text-primary">
          {activeCount} {activeCount === 1 ? "person" : "people"} • ₹
          {perPerson.toLocaleString("en-IN")} each
        </p>
      </Section>

      {/* Receipt */}
      <Section label="RECEIPT">
        <button
          type="button"
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-card/40 px-4 py-8 transition-smooth hover:border-primary hover:bg-card"
        >
          <Camera className="h-7 w-7 text-foreground" />
          <span className="text-base font-semibold text-foreground">
            Snap or upload receipt
          </span>
          <span className="text-xs text-muted-foreground">
            Restaurant? Everyone marks their order →
          </span>
        </button>
      </Section>

      {/* Save */}
      <button
        type="button"
        onClick={() => navigate({ to: "/app/dashboard" })}
        className="mt-2 inline-flex h-14 w-full items-center justify-center rounded-pill bg-gradient-primary text-base font-bold text-primary-foreground shadow-glow-lg transition-smooth hover:shadow-glow"
      >
        Add Expense
      </button>
    </div>
  );
}

function Section({
  label,
  sublabel,
  children,
}: {
  label: string;
  sublabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-1 text-xs font-bold tracking-wider text-muted-foreground">
        {label}
      </h2>
      {sublabel && <p className="mb-2 text-xs text-primary">{sublabel}</p>}
      <div className={sublabel ? "" : "mt-2"}>{children}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "relative h-7 w-12 rounded-full transition-smooth",
        on ? "bg-success" : "bg-border",
      )}
      aria-pressed={on}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all",
          on ? "left-6" : "left-1",
        )}
      />
    </button>
  );
}
