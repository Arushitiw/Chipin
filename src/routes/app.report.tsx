import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/app/report")({
  component: Report,
});

const CATEGORIES = [
  { name: "Flights", value: 125000, pct: 58, color: "#6C47FF", emoji: "✈️" },
  { name: "Hotel", value: 60000, pct: 28, color: "#FF6B6B", emoji: "🏨" },
  { name: "Food", value: 18000, pct: 8, color: "#FFB347", emoji: "🍽️" },
  { name: "Transport", value: 12000, pct: 6, color: "#00C896", emoji: "🚗" },
];

const PEOPLE = [
  { name: "Arjun", amount: 125000, pct: 100, initial: "A", color: "#6C47FF" },
  { name: "Sneha", amount: 60000, pct: 48, initial: "S", color: "#FF6B6B" },
  { name: "Rohan", amount: 18000, pct: 14, initial: "R", color: "#FFB347" },
  { name: "Priya", amount: 12000, pct: 10, initial: "P", color: "#00C896" },
  { name: "Karan", amount: 0, pct: 0, initial: "K", color: "#8B85FF" },
];

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function Report() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="space-y-6 pb-8">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Bali 2025 — Trip Report</h1>
        <p className="text-sm text-muted-foreground">Apr 18–25</p>
      </header>

      {/* Donut */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Spending breakdown</h2>
        <div className="relative h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {CATEGORIES.map((c, i) => (
                  <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={c.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={c.color} stopOpacity={0.55} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={CATEGORIES}
                dataKey="value"
                innerRadius={75}
                outerRadius={110}
                paddingAngle={2}
                stroke="none"
                onMouseEnter={(_, i) => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {CATEGORIES.map((c, i) => (
                  <Cell
                    key={i}
                    fill={`url(#grad-${i})`}
                    style={{
                      filter:
                        hovered === i
                          ? `drop-shadow(0 0 14px ${c.color})`
                          : "drop-shadow(0 0 4px rgba(0,0,0,0.4))",
                      transition: "filter 200ms",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1C1B29",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "white",
                }}
                formatter={(v: number, _n, p) => [fmt(v), p.payload.name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-foreground">₹2,15,000</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>

        {/* Category list */}
        <div className="mt-4 space-y-3">
          {CATEGORIES.map((c, i) => (
            <div key={c.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }}
                  />
                  {c.emoji} {c.name}
                </span>
                <span className="text-muted-foreground">
                  {fmt(c.value)} <span className="ml-2 text-xs">{c.pct}%</span>
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-card-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${c.pct}%`,
                    background: `linear-gradient(90deg, ${c.color}, ${c.color}88)`,
                    boxShadow: hovered === i ? `0 0 10px ${c.color}` : "none",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-person */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Who paid what</h2>
        <div className="space-y-4">
          {PEOPLE.map((p) => (
            <div key={p.name} className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: p.color, boxShadow: `0 0 10px ${p.color}66` }}
              >
                {p.initial}
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{p.name}</span>
                  <span className="text-muted-foreground">{fmt(p.amount)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-card-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(p.pct, 1)}%`,
                      background:
                        p.pct === 0
                          ? "transparent"
                          : "linear-gradient(90deg, #6C47FF, #FF6B6B)",
                      boxShadow: p.pct > 0 ? "0 0 10px rgba(108,71,255,0.5)" : "none",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insight */}
      <div
        className="rounded-2xl p-[1.5px]"
        style={{
          background: "linear-gradient(135deg, #FFB347, #FF6B6B)",
          boxShadow: "0 0 24px rgba(255,179,71,0.25)",
        }}
      >
        <div className="rounded-2xl bg-card p-4">
          <p className="text-sm leading-relaxed text-foreground">
            <span className="mr-1">💡</span>
            <span className="font-semibold">Flights took up 58% of your budget.</span>{" "}
            <span className="text-muted-foreground">
              Consider budget airlines next time!
            </span>
          </p>
        </div>
      </div>

      {/* Download */}
      <button
        className="w-full rounded-pill py-4 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
        style={{
          background: "linear-gradient(90deg, #6C47FF, #FF6B6B)",
          boxShadow: "0 8px 30px rgba(108,71,255,0.45)",
        }}
      >
        ⬇ Download PDF Report
      </button>
    </div>
  );
}
