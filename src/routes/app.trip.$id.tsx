import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/app/trip/$id")({
  component: TripDetail,
});

const members = [
  { initial: "A", color: "bg-primary" },
  { initial: "R", color: "bg-secondary" },
  { initial: "S", color: "bg-accent" },
  { initial: "P", color: "bg-success" },
  { initial: "K", color: "bg-destructive" },
];

const expenses = [
  {
    icon: "✈",
    iconBg: "bg-primary/20 text-primary",
    name: "Flight",
    paidBy: "Arjun",
    pill: "You owe",
    pillTone: "text-secondary bg-secondary/15",
    total: "₹1,25,000",
    per: "₹25,000 / person",
  },
  {
    icon: "🏨",
    iconBg: "bg-secondary/20 text-secondary",
    name: "Hotel",
    paidBy: "Sneha",
    pill: "You owe",
    pillTone: "text-secondary bg-secondary/15",
    total: "₹60,000",
    per: "₹12,000 / person",
  },
  {
    icon: "🍽",
    iconBg: "bg-accent/20 text-accent",
    name: "Dinner",
    paidBy: "Rohan",
    pill: "Settled",
    pillTone: "text-success bg-success/15",
    total: "₹18,000",
    per: "₹3,600 / person",
  },
  {
    icon: "🚗",
    iconBg: "bg-success/20 text-success",
    name: "Scooters",
    paidBy: "Priya",
    pill: "You owe",
    pillTone: "text-secondary bg-secondary/15",
    total: "₹12,000",
    per: "₹2,400 / person",
  },
];

const tabs = ["Expenses", "Balances", "My Share"] as const;

function TripDetail() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Expenses");

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bali 2025</h1>
          <p className="text-sm text-muted-foreground">Apr 18–25</p>
        </div>
        <div className="flex items-center gap-3">
          {members.map((m) => (
            <div
              key={m.initial}
              className="rounded-full bg-gradient-primary p-[2px] shadow-glow"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${m.color} text-sm font-bold text-primary-foreground ring-2 ring-background`}
              >
                {m.initial}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total Spent" value="₹2,15,000" />
        <StatCard label="Per Person" value="₹43,000" />
        <StatCard label="Settled" value="60%">
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full w-[60%] rounded-full bg-success" />
          </div>
        </StatCard>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border">
        {tabs.map((t) => {
          const isActive = active === t;
          return (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`relative pb-3 text-sm font-semibold transition-smooth ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {isActive && (
                <span className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-gradient-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Expense list */}
      {active === "Expenses" && (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {expenses.map((e) => (
            <li key={e.name} className="flex items-center gap-3 p-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${e.iconBg}`}
              >
                {e.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{e.name}</p>
                  <span
                    className={`rounded-pill px-2 py-0.5 text-[10px] font-semibold ${e.pillTone}`}
                  >
                    {e.pill}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Paid by {e.paidBy}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{e.total}</p>
                <p className="text-xs text-muted-foreground">{e.per}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {active === "Balances" && (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Balances view
        </div>
      )}
      {active === "My Share" && (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          My share view
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-gradient-primary p-[1px] shadow-glow">
      <div className="h-full rounded-[7px] bg-card p-3">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-base font-bold text-foreground">{value}</p>
        {children}
      </div>
    </div>
  );
}
