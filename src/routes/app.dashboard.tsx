import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-2xl font-bold">Your trips</h1>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-pill bg-gradient-primary text-sm font-bold text-primary-foreground shadow-glow">
          C
        </div>
      </header>

      <div className="rounded-lg bg-gradient-primary p-6 shadow-glow-lg">
        <p className="text-sm font-medium text-primary-foreground/80">Total balance</p>
        <p className="mt-1 text-4xl font-bold text-primary-foreground">+$124.50</p>
        <p className="mt-2 text-sm text-primary-foreground/80">You're owed across 2 trips</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Active trips</h2>
        {[
          { id: "1", name: "Lisbon weekend", members: 4, balance: "+$84.00" },
          { id: "2", name: "Ski trip · Chamonix", members: 6, balance: "+$40.50" },
        ].map((t) => (
          <Link
            key={t.id}
            to="/app/trip/$id"
            params={{ id: t.id }}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-smooth hover:border-primary/40 hover:shadow-glow"
          >
            <div>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.members} members</p>
            </div>
            <span className="font-semibold text-success">{t.balance}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
