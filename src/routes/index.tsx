import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ChipIn — Your group trips, perfectly split" },
      {
        name: "description",
        content:
          "ChipIn handles every group expense, reminds late payers, and keeps everyone on the same page — in real time. Split trips, not friendships.",
      },
      { property: "og:title", content: "ChipIn — Your group trips, perfectly split" },
      {
        property: "og:description",
        content: "Track shared spending, settle balances, and end the awkward money talks.",
      },
    ],
  }),
  component: Landing,
});

function GradientIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-2xl shadow-glow">
      {children}
    </div>
  );
}

function FloatingBadge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-pill border border-border bg-card/80 px-4 py-2 text-xs font-medium text-foreground backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main>
        {/* HERO */}
        <section id="home" className="relative overflow-hidden">
          {/* Ambient glows */}
          <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute top-40 right-0 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
            {/* Left */}
            <div>
              <span className="inline-flex items-center rounded-pill border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary">
                ✨ NEW: RECEIPT SCAN &amp; SPLIT
              </span>
              <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[64px]">
                Your group trips,
                <br />
                <span className="text-gradient-primary">perfectly split</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                No more awkward money chats. ChipIn handles every expense,
                reminds late payers, and keeps everyone on the same page — in
                real time.
              </p>

              <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/app/dashboard"
                  className="inline-flex h-12 items-center justify-center rounded-pill bg-gradient-primary px-7 text-base font-semibold text-primary-foreground shadow-glow-lg transition-smooth hover:scale-[1.02]"
                >
                  Start a trip free →
                </Link>
                <a
                  href="#features"
                  className="inline-flex h-12 items-center justify-center rounded-pill border border-border bg-card px-7 text-base font-semibold text-foreground transition-smooth hover:bg-card-2"
                >
                  See how it works
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-2.5">
                <FloatingBadge>✓ No app download needed</FloatingBadge>
                <FloatingBadge>⚡ Real-time sync</FloatingBadge>
                <FloatingBadge>🌍 Multi-currency</FloatingBadge>
              </div>
            </div>

            {/* Right — Phone mockup */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-primary opacity-30 blur-3xl" />
              <div className="relative rounded-[2.5rem] border border-border bg-card p-3 shadow-glow-lg">
                <div className="rounded-[2rem] bg-background p-5">
                  <div className="mx-auto mb-3 h-1.5 w-20 rounded-full bg-card-2" />
                  <div className="text-xs text-muted-foreground">
                    Apr 18 – 25 • 5 members
                  </div>
                  <div className="mt-1 text-2xl font-bold">Bali 2025 🌴</div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { v: "₹2,15,000", l: "Total" },
                      { v: "₹43,000", l: "Per Person" },
                      { v: "60%", l: "Settled" },
                    ].map((s) => (
                      <div key={s.l} className="rounded-xl bg-card-2 p-3">
                        <div className="text-sm font-bold">{s.v}</div>
                        <div className="text-[10px] text-muted-foreground">{s.l}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2">
                    {[
                      { i: "✈️", t: "Flights", p: "Paid by Arjun", a: "₹1,25,000" },
                      { i: "🏨", t: "Hotel Padma", p: "Paid by Sneha", a: "₹60,000" },
                      { i: "🍽️", t: "Restaurant", p: "Paid by Rohan", a: "₹18,000" },
                      { i: "🚐", t: "Transport", p: "Paid by Arjun", a: "₹12,000" },
                    ].map((e) => (
                      <div key={e.t} className="flex items-center gap-3 rounded-xl bg-card-2 p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-base">
                          {e.i}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">{e.t}</div>
                          <div className="truncate text-[11px] text-muted-foreground">{e.p}</div>
                        </div>
                        <div className="text-sm font-bold">{e.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -left-4 bottom-24 hidden lg:block">
                <FloatingBadge>
                  <span className="text-success">🌍</span> Multi-currency
                </FloatingBadge>
              </div>
              <div className="absolute -right-4 bottom-8 hidden lg:block">
                <FloatingBadge>
                  <span className="text-accent">⚡</span> Real-time sync
                </FloatingBadge>
              </div>
              <div className="absolute -right-2 top-12 hidden lg:block">
                <FloatingBadge>✓ No awkward chats</FloatingBadge>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-sm font-bold tracking-widest text-primary">WHY CHIP·IN</div>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Why we built <span className="text-gradient-primary">chip·in</span>
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: "🤝",
                  title: "No more awkward asks",
                  desc: "The app sends payment reminders so you never have to. Stay the good friend, always.",
                },
                {
                  icon: "✈️",
                  title: "Built for real trips",
                  desc: "From Bali to Bandra, handle every rupee or dollar. Multi-currency, always accurate.",
                },
                {
                  icon: "⚡",
                  title: "Live for everyone",
                  desc: "Every expense updates in real time for all trip members. No refresh needed.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="group relative rounded-2xl border border-border bg-card p-7 transition-smooth hover:border-primary/50 hover:shadow-glow"
                >
                  <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-primary opacity-0 blur-xl transition-smooth group-hover:opacity-20" />
                  <GradientIcon>{c.icon}</GradientIcon>
                  <h3 className="mt-5 text-xl font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>

            <blockquote className="mx-auto mt-16 max-w-3xl text-center">
              <p className="text-2xl font-medium italic leading-relaxed text-muted-foreground sm:text-3xl">
                "We built chip·in because we were tired of the post-trip
                spreadsheet drama. Money shouldn't ruin friendships."
              </p>
              <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-primary" />
            </blockquote>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="relative py-20 sm:py-28">
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-sm font-bold tracking-widest text-primary">FEATURES</div>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Everything your trip needs
              </h2>
            </div>

            <div className="mt-20 space-y-24 sm:space-y-32">
              <FeatureRow
                icon="⚡"
                title="Smart Splits"
                desc="Split equally or by who actually joined. Scuba diving? Only charge the 3 people who went. Everyone else pays zero."
                visual={<SmartSplitsVisual />}
                reverse
              />
              <FeatureRow
                icon="📊"
                title="Crystal Clear Balances"
                desc="See exactly who owes whom — in one glance. Green means you're owed money. Red means you owe."
                visual={<BalancesVisual />}
              />
              <FeatureRow
                icon="📷"
                title="Scan & Split Instantly"
                desc="Snap a restaurant receipt. Everyone taps what they ordered. Bill distributed automatically — no guessing, no arguments."
                visual={<ReceiptVisual />}
                reverse
              />
              <FeatureRow
                icon="🔔"
                title="Never Chase Again"
                desc="chip·in sends gentle (then firm) reminders to late payers on your behalf. You stay the good friend."
                visual={<ReminderVisual />}
              />
              <FeatureRow
                icon="🌍"
                title="Any Currency, Anywhere"
                desc="Paid in IDR, USD, or EUR? Log it in any currency. We convert to your base currency and lock the rate at time of payment."
                visual={<CurrencyVisual />}
                reverse
              />
              <FeatureRow
                icon="📈"
                title="Full Trip Report"
                desc="When the trip ends, get a beautiful breakdown — by category, by person, with charts and a downloadable PDF."
                visual={<ReportVisual />}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="how" className="relative py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-12 text-center shadow-glow-lg sm:p-16">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-primary opacity-10" />
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Ready to split smarter?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join thousands of travellers who use chip·in to keep trips fun
                and finances fair.
              </p>
              <Link
                to="/app/dashboard"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-pill bg-gradient-primary px-8 text-base font-semibold text-primary-foreground shadow-glow-lg transition-smooth hover:scale-[1.02]"
              >
                Start your trip free →
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-border bg-card/30">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-12 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <svg className="h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">
                chip<span className="text-gradient-primary">·in</span>
              </span>
            </Link>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="transition-smooth hover:text-foreground">Features</a>
              <a href="#how" className="transition-smooth hover:text-foreground">How it works</a>
              <a href="#about" className="transition-smooth hover:text-foreground">About</a>
              <a href="#" className="transition-smooth hover:text-foreground">Privacy</a>
              <a href="#" className="transition-smooth hover:text-foreground">Terms</a>
            </nav>
            <div className="text-center text-sm text-muted-foreground">
              © 2026 chip·in. Split trips, not friendships.
            </div>
            <div className="text-xs text-muted-foreground">
              Made with <span className="text-secondary">♥</span> for travellers
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
