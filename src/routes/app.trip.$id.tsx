import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Receipt, Settings, Share2 } from "lucide-react";
import { fetchTrip, fetchExpenses } from "@/lib/api";
import type { Trip } from "@/lib/trips";
import type { Expense } from "@/lib/expenses";
import {
  EmptyState, ErrorState, ShimmerCard, ReceiptIcon, GradientCTA,
} from "@/components/states";

export const Route = createFileRoute("/app/trip/$id")({
  component: TripDetail,
});

const tabs = ["Expenses", "Balances", "My Share"] as const;

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function fmtDateRange(start?: string, end?: string) {
  if (!start && !end) return "No dates set";
  const f = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      : "?";
  return `${f(start)} – ${f(end)}`;
}

function TripDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState<(typeof tabs)[number]>("Expenses");

  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setError(null);
    setTrip(undefined);
    setExpenses(null);
    Promise.all([fetchTrip(id), fetchExpenses(id)])
      .then(([t, e]) => {
        setTrip(t);
        setExpenses(e);
      })
      .catch(() => setError("Couldn't load this trip"));
  };

  useEffect(() => { load(); }, [id]);

  if (error) return <ErrorState message={error} onRetry={load} />;

  if (trip === undefined) {
    return (
      <div className="space-y-4">
        <ShimmerCard className="h-20" />
        <div className="grid grid-cols-3 gap-3">
          <ShimmerCard className="h-20" />
          <ShimmerCard className="h-20" />
          <ShimmerCard className="h-20" />
        </div>
        <ShimmerCard className="h-40" />
      </div>
    );
  }

  if (trip === null) {
    return (
      <EmptyState
        icon={<ReceiptIcon />}
        title="Trip not found"
        subtitle="It may have been deleted."
        action={<GradientCTA to="/app/dashboard">Back to dashboard</GradientCTA>}
      />
    );
  }

  const totalSpent = (expenses || []).reduce((s, e) => s + e.amount, 0);
  const perPerson = trip.members.length
    ? Math.round(totalSpent / trip.members.length)
    : 0;
  const onlyCreator = trip.members.length <= 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{trip.name}</h1>
            <p className="text-sm text-muted-foreground">
              {fmtDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>
          <button
            onClick={() => navigate({ to: "/app/trip/$id/settings", params: { id } })}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {!onlyCreator && (
          <div className="flex items-center gap-2">
            {trip.members.map((m, i) => (
              <div
                key={m.name + i}
                className="rounded-full bg-gradient-primary p-[2px] shadow-glow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-sm font-bold text-foreground ring-2 ring-background">
                  {m.name.charAt(0).toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Invite-only empty state when only the creator is in the trip */}
      {onlyCreator && (
        <EmptyState
          icon={<Share2 className="h-7 w-7" />}
          title="Invite your friends to get started"
          subtitle="Share the invite link so they can join the trip and split expenses with you."
          action={
            <GradientCTA to={`/app/trip/${id}/invite`}>
              <Share2 className="h-4 w-4" /> Share invite link
            </GradientCTA>
          }
        />
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total Spent" value={fmt(totalSpent)} />
        <StatCard label="Per Person" value={fmt(perPerson)} />
        <StatCard label="Members" value={String(trip.members.length)} />
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
        <>
          {expenses === null ? (
            <div className="space-y-2">
              <ShimmerCard className="h-16" />
              <ShimmerCard className="h-16" />
            </div>
          ) : expenses.length === 0 ? (
            <EmptyState
              icon={<ReceiptIcon />}
              title="No expenses logged yet"
              subtitle="Tap + to add the first expense"
              action={
                <Link
                  to="/app/add-expense"
                  search={{ type: trip.type, name: trip.name }}
                  className="inline-flex items-center gap-2 rounded-pill bg-gradient-to-r from-[#6C47FF] to-[#FF6B6B] px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
                >
                  <Plus className="h-4 w-4" /> Add expense
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border bg-card">
              {expenses.map((e) => {
                const share = trip.members.length
                  ? Math.round(e.amount / trip.members.length)
                  : 0;
                return (
                  <li key={e.id} className="flex items-center gap-3 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/20 text-lg text-primary">
                      {e.emoji || "🧾"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{e.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Paid by {e.paidBy} · {e.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{fmt(e.amount)}</p>
                      <p className="text-xs text-muted-foreground">{fmt(share)} / person</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {active === "Balances" && (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          <Link to="/app/balances" className="text-primary underline">
            Open the Balances tab
          </Link>{" "}
          for a full breakdown.
        </div>
      )}
      {active === "My Share" && (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Per-person share will appear here once expenses are added.
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gradient-primary p-[1px] shadow-glow">
      <div className="h-full rounded-[7px] bg-card p-3">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-base font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
