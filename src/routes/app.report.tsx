import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { fetchTrips, fetchReport, type CategoryTotal, type PersonTotal } from "@/lib/api";
import type { Trip } from "@/lib/trips";
import {
  EmptyState, ErrorState, ShimmerCard, GradientCTA, ReceiptIcon, SuitcaseIcon,
} from "@/components/states";

export const Route = createFileRoute("/app/report")({
  component: Report,
});

const PALETTE = ["#6C47FF", "#FF6B6B", "#FFB347", "#00C896", "#8B85FF", "#7FE6C8"];
const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

function fmtDateRange(start?: string, end?: string) {
  if (!start && !end) return "";
  const f = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      : "?";
  return `${f(start)} – ${f(end)}`;
}

function Report() {
  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);
  const [data, setData] = useState<{
    totalSpent: number;
    categories: CategoryTotal[];
    people: PersonTotal[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const load = () => {
    setError(null);
    setTrip(undefined);
    setData(null);
    fetchTrips()
      .then(async (trips) => {
        const latest = trips[0] || null;
        setTrip(latest);
        if (!latest) return;
        const r = await fetchReport(latest.id);
        setData(r);
      })
      .catch(() => setError("Couldn't load the report"));
  };

  useEffect(() => { load(); }, []);

  if (error) return <ErrorState message={error} onRetry={load} />;

  if (trip === undefined) {
    return (
      <div className="space-y-4">
        <ShimmerCard className="h-16" />
        <ShimmerCard className="h-72" />
        <ShimmerCard className="h-40" />
      </div>
    );
  }

  if (trip === null) {
    return (
      <EmptyState
        icon={<SuitcaseIcon />}
        title="No trips yet"
        subtitle="Create your first trip and invite your friends"
        action={<GradientCTA to="/app/dashboard">Create a Trip</GradientCTA>}
      />
    );
  }

  if (!data || data.totalSpent === 0) {
    return (
      <div className="space-y-6 pb-8">
        <header>
          <h1 className="text-2xl font-bold text-foreground">{trip.name} — Trip Report</h1>
          <p className="text-sm text-muted-foreground">{fmtDateRange(trip.startDate, trip.endDate)}</p>
        </header>
        <EmptyState
          icon={<ReceiptIcon />}
          title="No expenses logged yet"
          subtitle="Tap + to add the first expense — the report will populate automatically."
        />
      </div>
    );
  }

  const cats = data.categories.map((c, i) => ({ ...c, color: PALETTE[i % PALETTE.length] }));
  const top = cats[0];

  return (
    <div className="space-y-6 pb-8">
      <header>
        <h1 className="text-2xl font-bold text-foreground">{trip.name} — Trip Report</h1>
        <p className="text-sm text-muted-foreground">{fmtDateRange(trip.startDate, trip.endDate)}</p>
      </header>

      {/* Donut */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-glow">
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Spending breakdown</h2>
        <div className="relative h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {cats.map((c, i) => (
                  <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={c.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={c.color} stopOpacity={0.55} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={cats}
                dataKey="value"
                innerRadius={75}
                outerRadius={110}
                paddingAngle={2}
                stroke="none"
                onMouseEnter={(_, i) => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {cats.map((c, i) => (
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
            <p className="text-2xl font-bold text-foreground">{fmt(data.totalSpent)}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {cats.map((c, i) => (
            <div key={c.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }}
                  />
                  {c.name}
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
          {data.people.map((p, i) => (
            <div key={p.name} className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{
                  background: PALETTE[i % PALETTE.length],
                  boxShadow: `0 0 10px ${PALETTE[i % PALETTE.length]}66`,
                }}
              >
                {p.name.charAt(0).toUpperCase()}
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
                        p.pct === 0 ? "transparent" : "linear-gradient(90deg, #6C47FF, #FF6B6B)",
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
      {top && (
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
              <span className="font-semibold">
                {top.name} took up {top.pct}% of your budget.
              </span>{" "}
              <span className="text-muted-foreground">
                Worth a look when planning your next split.
              </span>
            </p>
          </div>
        </div>
      )}

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
