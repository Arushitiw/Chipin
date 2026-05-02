import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ChipIn — Split group trip expenses, effortlessly" },
      {
        name: "description",
        content:
          "ChipIn makes splitting trip expenses with friends simple. Track shared spending, settle balances, and end the awkward money talks.",
      },
      { property: "og:title", content: "ChipIn — Split group trip expenses, effortlessly" },
      {
        property: "og:description",
        content: "Track shared spending, settle balances, and end the awkward money talks.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-primary opacity-20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-pill border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
              ✨ Built for group trips
            </span>
            <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-7xl">
              Split expenses,{" "}
              <span className="text-gradient-primary">not friendships.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              ChipIn tracks who paid for what on your group trips, then settles
              everything up at the end — no awkward math, no chasing receipts.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/app/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-pill bg-gradient-primary px-8 text-base font-semibold text-primary-foreground shadow-glow-lg transition-smooth hover:scale-[1.02]"
              >
                Get started — it's free
              </Link>
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-pill border border-border bg-card px-8 text-base font-semibold text-foreground transition-smooth hover:bg-card-2"
              >
                See how it works
              </a>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section id="features" className="grid gap-4 pb-24 sm:grid-cols-3">
          {[
            {
              emoji: "💸",
              title: "Track every expense",
              desc: "Log shared costs in seconds. Categorise, split evenly or by share.",
            },
            {
              emoji: "📊",
              title: "Live balances",
              desc: "See who owes whom in real time. No spreadsheets required.",
            },
            {
              emoji: "🎯",
              title: "Settle up smart",
              desc: "We compute the fewest payments needed to settle the group.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-border bg-card p-6 shadow-card transition-smooth hover:border-primary/40 hover:shadow-glow"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-card-2 text-2xl">
                {f.emoji}
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
