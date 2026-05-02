import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/report")({
  component: Report,
});

function Report() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Report</h1>
        <p className="text-sm text-muted-foreground">Spending insights across your trips.</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total spent</p>
          <p className="mt-1 text-2xl font-bold">$1,284</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Trips</p>
          <p className="mt-1 text-2xl font-bold">4</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">By category</h2>
        <div className="space-y-3">
          {[
            { c: "Food & drink", v: 62, color: "bg-gradient-primary" },
            { c: "Lodging", v: 28, color: "bg-accent" },
            { c: "Transport", v: 10, color: "bg-success" },
          ].map((row) => (
            <div key={row.c}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{row.c}</span>
                <span className="text-muted-foreground">{row.v}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-pill bg-card-2">
                <div className={`h-full ${row.color}`} style={{ width: `${row.v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
