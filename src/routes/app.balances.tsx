import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/app/balances")({
  component: Balances,
});

type Row = {
  name: string;
  initial: string;
  ring: string; // bg color for avatar
  paid: string;
  share: string;
  owes: { dir: "in" | "out" | "zero"; text: string; sub?: string };
  net: number; // in rupees
  netLabel: string;
};

const rows: Row[] = [
  {
    name: "Arjun",
    initial: "A",
    ring: "bg-primary/20 text-primary border-primary",
    paid: "₹1,25,000",
    share: "₹43,000",
    owes: { dir: "in", text: "Receives from others" },
    net: 82000,
    netLabel: "+₹82,000",
  },
  {
    name: "Rohan",
    initial: "R",
    ring: "bg-secondary/20 text-secondary border-secondary",
    paid: "₹18,000",
    share: "₹43,000",
    owes: { dir: "out", text: "Owes Arjun", sub: "₹25,000" },
    net: -25000,
    netLabel: "−₹25,000",
  },
  {
    name: "Sneha",
    initial: "S",
    ring: "bg-success/20 text-success border-success",
    paid: "₹60,000",
    share: "₹43,000",
    owes: { dir: "in", text: "Receives from others" },
    net: 17000,
    netLabel: "+₹17,000",
  },
  {
    name: "Priya",
    initial: "P",
    ring: "bg-accent/20 text-accent border-accent",
    paid: "₹12,000",
    share: "₹43,000",
    owes: { dir: "out", text: "Owes Arjun", sub: "₹31,000" },
    net: -31000,
    netLabel: "−₹31,000",
  },
  {
    name: "Karan",
    initial: "K",
    ring: "bg-destructive/20 text-destructive border-destructive",
    paid: "₹0",
    share: "₹43,000",
    owes: { dir: "out", text: "Owes Arjun", sub: "₹43,000" },
    net: -43000,
    netLabel: "−₹43,000",
  },
];

const settlements = [
  { from: "Karan", fromRing: "bg-destructive/20 text-destructive border-destructive", to: "Arjun", amount: "₹43,000" },
  { from: "Priya", fromRing: "bg-accent/20 text-accent border-accent", to: "Arjun", amount: "₹31,000" },
  { from: "Rohan", fromRing: "bg-secondary/20 text-secondary border-secondary", to: "Arjun", amount: "₹17,000" },
  { from: "Rohan", fromRing: "bg-secondary/20 text-secondary border-secondary", to: "Sneha", amount: "₹8,000" },
];

function NetPill({ value, label }: { value: number; label: string }) {
  if (value > 0) {
    return (
      <span className="inline-flex items-center rounded-pill bg-success/15 px-3 py-1.5 text-sm font-bold text-success shadow-[0_0_20px_-4px_hsl(var(--success)/0.6)]">
        {label}
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="inline-flex items-center rounded-pill bg-destructive/15 px-3 py-1.5 text-sm font-bold text-destructive shadow-[0_0_20px_-4px_hsl(var(--destructive)/0.6)]">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-pill bg-card-2 px-3 py-1.5 text-sm font-bold text-muted-foreground">
      {label}
    </span>
  );
}

function Avatar({ initial, ring }: { initial: string; ring: string }) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${ring}`}
    >
      {initial}
    </div>
  );
}

function Balances() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate({ to: "/app/dashboard" })}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card-2 text-foreground transition-smooth hover:bg-border"
              aria-label="Back"
            >
              ←
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Who owes what</h1>
              <p className="text-sm text-primary/80">Bali 2025</p>
            </div>
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            ↑
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-pill bg-success/15 px-4 py-2 text-sm font-semibold text-success shadow-[0_0_20px_-6px_hsl(var(--success)/0.6)]">
            ₹99,000 to receive
          </span>
          <span className="inline-flex items-center rounded-pill bg-destructive/15 px-4 py-2 text-sm font-semibold text-destructive shadow-[0_0_20px_-6px_hsl(var(--destructive)/0.6)]">
            ₹99,000 to pay
          </span>
        </div>
      </header>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="bg-card-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Person</th>
                <th className="px-4 py-3 font-semibold">Paid</th>
                <th className="px-4 py-3 font-semibold">Share</th>
                <th className="px-4 py-3 font-semibold">Owes</th>
                <th className="px-4 py-3 font-semibold">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.name} className="transition-smooth hover:bg-card-2/50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-gradient-primary p-[1.5px]">
                        <Avatar initial={r.initial} ring={`${r.ring} bg-card`} />
                      </div>
                      <span className="font-semibold text-foreground">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-semibold text-foreground">{r.paid}</td>
                  <td className="px-4 py-4 text-muted-foreground">{r.share}</td>
                  <td className="px-4 py-4">
                    {r.owes.dir === "in" && (
                      <p className="text-xs leading-tight text-success">
                        ← {r.owes.text}
                      </p>
                    )}
                    {r.owes.dir === "out" && (
                      <p className="text-xs leading-tight text-accent">
                        → {r.owes.text}
                        {r.owes.sub && (
                          <span className="block font-semibold">{r.owes.sub}</span>
                        )}
                      </p>
                    )}
                    {r.owes.dir === "zero" && (
                      <p className="text-xs text-muted-foreground">—</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <NetPill value={r.net} label={r.netLabel} />
                  </td>
                </tr>
              ))}
              <tr className="bg-gradient-primary/20">
                <td className="px-4 py-4 font-bold text-foreground">TOTAL</td>
                <td className="px-4 py-4 font-bold text-foreground">₹2,15,000</td>
                <td className="px-4 py-4 font-bold text-foreground">₹2,15,000</td>
                <td className="px-4 py-4 text-muted-foreground">—</td>
                <td className="px-4 py-4">
                  <NetPill value={0} label="₹0" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Reminder */}
      <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4 shadow-[0_0_30px_-10px_hsl(var(--accent)/0.6)]">
        <div className="flex items-start gap-3">
          <span className="text-xl">🔔</span>
          <div>
            <p className="font-semibold text-accent">Auto-reminders active</p>
            <p className="text-sm text-muted-foreground">
              Reminder sent to Karan and Priya — next reminder in 3 days
            </p>
          </div>
        </div>
      </div>

      {/* Suggested payments */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Suggested Payments
        </p>
        <ul className="space-y-2">
          {settlements.map((s, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <Avatar initial={s.from[0]} ring={s.fromRing} />
              <div className="flex-1 text-sm">
                <span className="font-semibold text-foreground">{s.from}</span>
                <span className="px-1.5 text-muted-foreground">pays</span>
                <span className="font-semibold text-foreground">{s.to}</span>
              </div>
              <span className="font-bold text-destructive">{s.amount}</span>
              <button className="rounded-pill bg-success/15 px-3 py-1.5 text-xs font-semibold text-success transition-smooth hover:bg-success/25">
                Mark paid
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Settle up button */}
      <button className="w-full rounded-pill bg-gradient-primary py-4 text-base font-bold text-primary-foreground shadow-glow-lg transition-smooth hover:opacity-95">
        Settle Up All ✓
      </button>
    </div>
  );
}
