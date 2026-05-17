import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchTrips, fetchSettlements, type Balance, type Settlement } from "@/lib/api";
import type { Trip } from "@/lib/trips";
import {
  EmptyState, ErrorState, ShimmerCard, GradientCTA, ScaleIcon, SuitcaseIcon,
} from "@/components/states";

export const Route = createFileRoute("/app/balances")({
  component: BalancesPage,
});

const fmt = (n: number) => `${n < 0 ? "−" : ""}₹${Math.abs(Math.round(n)).toLocaleString("en-IN")}`;

function BalancesPage() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);
  const [data, setData] = useState<{
    balances: Balance[];
    settlements: Settlement[];
    totalSpent: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setError(null);
    setTrip(undefined);
    setData(null);
    fetchTrips()
      .then(async (trips) => {
        const latest = trips[0] || null;
        setTrip(latest);
        if (!latest) return;
        const s = await fetchSettlements(latest.id);
        setData(s);
      })
      .catch(() => setError("Couldn't load balances"));
  };

  useEffect(() => { load(); }, []);

  if (error) return <ErrorState message={error} onRetry={load} />;

  if (trip === undefined) {
    return (
      <div className="space-y-4">
        <ShimmerCard className="h-20" />
        <ShimmerCard className="h-64" />
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

  const allSettled =
    !data ||
    (data.totalSpent === 0 && data.settlements.length === 0) ||
    data.balances.every((b) => Math.abs(b.net) < 0.5);

  const toReceive = data
    ? data.balances.filter((b) => b.net > 0).reduce((s, b) => s + b.net, 0)
    : 0;
  const toPay = data
    ? data.balances.filter((b) => b.net < 0).reduce((s, b) => s + Math.abs(b.net), 0)
    : 0;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate({ to: "/app/dashboard" })}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card-2 text-foreground"
              aria-label="Back"
            >
              ←
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Who owes what</h1>
              <p className="text-sm text-primary/80">{trip.name}</p>
            </div>
          </div>
        </div>

        {data && !allSettled && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-pill bg-success/15 px-4 py-2 text-sm font-semibold text-success">
              {fmt(toReceive)} to receive
            </span>
            <span className="rounded-pill bg-destructive/15 px-4 py-2 text-sm font-semibold text-destructive">
              {fmt(toPay)} to pay
            </span>
          </div>
        )}
      </header>

      {data === null && (
        <div className="space-y-3">
          <ShimmerCard className="h-16" />
          <ShimmerCard className="h-16" />
        </div>
      )}

      {data && allSettled && (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00C896]/15 text-[#00C896]">
            <ScaleIcon />
          </div>
          <h3 className="text-lg font-bold text-[#00C896]">All settled up! 🎉</h3>
          <p className="mt-1 text-sm text-muted-foreground">No pending balances</p>
        </div>
      )}

      {data && !allSettled && (
        <>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-card-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Person</th>
                  <th className="px-4 py-3 font-semibold">Paid</th>
                  <th className="px-4 py-3 font-semibold">Share</th>
                  <th className="px-4 py-3 font-semibold">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.balances.map((b) => (
                  <tr key={b.name}>
                    <td className="px-4 py-4 font-semibold text-foreground">{b.name}</td>
                    <td className="px-4 py-4 text-foreground">{fmt(b.paid)}</td>
                    <td className="px-4 py-4 text-muted-foreground">{fmt(b.share)}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-pill px-3 py-1.5 text-xs font-bold ${
                          b.net > 0
                            ? "bg-success/15 text-success"
                            : b.net < 0
                              ? "bg-destructive/15 text-destructive"
                              : "bg-card-2 text-muted-foreground"
                        }`}
                      >
                        {fmt(b.net)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Suggested Payments
            </p>
            <ul className="space-y-2">
              {data.settlements.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/20 text-sm font-bold text-destructive">
                    {s.from.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-sm">
                    <span className="font-semibold text-foreground">{s.from}</span>
                    <span className="px-1.5 text-muted-foreground">pays</span>
                    <span className="font-semibold text-foreground">{s.to}</span>
                  </div>
                  <span className="font-bold text-destructive">{fmt(s.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
