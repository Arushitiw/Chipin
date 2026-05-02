import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/trip/$id")({
  component: TripDetail,
});

function TripDetail() {
  const { id } = Route.useParams();

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <Link
          to="/app/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-card text-muted-foreground transition-smooth hover:text-foreground"
        >
          ←
        </Link>
        <div>
          <p className="text-xs text-muted-foreground">Trip #{id}</p>
          <h1 className="text-2xl font-bold">Lisbon weekend</h1>
        </div>
      </header>

      <div className="rounded-lg border border-border bg-card-2 p-5">
        <p className="text-sm text-muted-foreground">Trip total</p>
        <p className="mt-1 text-3xl font-bold">$842.30</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Recent expenses</h2>
        {[
          { t: "Dinner at Time Out Market", a: "$96.20", who: "Paid by Maya" },
          { t: "Tuk-tuk tour", a: "$120.00", who: "Paid by you" },
          { t: "Airbnb · 2 nights", a: "$480.00", who: "Paid by Jordan" },
        ].map((e) => (
          <div
            key={e.t}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
          >
            <div>
              <p className="font-medium">{e.t}</p>
              <p className="text-sm text-muted-foreground">{e.who}</p>
            </div>
            <span className="font-semibold">{e.a}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
