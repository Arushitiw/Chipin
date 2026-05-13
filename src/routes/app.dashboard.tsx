import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles, Plane, Sun, UtensilsCrossed, ArrowRight, Plus, Wand2,
  Hotel, Car, Ticket, Coffee, Waves, Mountain, ShoppingBag, Music,
} from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/app/dashboard")({
  component: Dashboard,
});

const ACTIVITIES: Record<string, { id: string; label: string; icon: any; color: string }[]> = {
  trip: [
    { id: "flights", label: "Flights", icon: Plane, color: "from-[#6C47FF] to-[#A78BFF]" },
    { id: "hotel", label: "Hotel / Stay", icon: Hotel, color: "from-[#FF6B6B] to-[#FF9A8B]" },
    { id: "scuba", label: "Scuba / Activity", icon: Waves, color: "from-[#00C896] to-[#5DE0C0]" },
    { id: "cabs", label: "Cabs / Transfers", icon: Car, color: "from-[#FFB347] to-[#FFD89B]" },
    { id: "trek", label: "Trek / Tour", icon: Mountain, color: "from-[#6C47FF] to-[#FF6B6B]" },
    { id: "shop", label: "Shopping", icon: ShoppingBag, color: "from-[#FF6B6B] to-[#6C47FF]" },
  ],
  dayout: [
    { id: "tickets", label: "Park Tickets", icon: Ticket, color: "from-[#FFB347] to-[#FF6B6B]" },
    { id: "fuel", label: "Fuel / Cab", icon: Car, color: "from-[#00C896] to-[#FFB347]" },
    { id: "snacks", label: "Snacks", icon: Coffee, color: "from-[#FF6B6B] to-[#FFB347]" },
    { id: "concert", label: "Concert / Event", icon: Music, color: "from-[#6C47FF] to-[#FF6B6B]" },
  ],
  bite: [
    { id: "dinner", label: "Dinner", icon: UtensilsCrossed, color: "from-[#00C896] to-[#6C47FF]" },
    { id: "cafe", label: "Café / Drinks", icon: Coffee, color: "from-[#FFB347] to-[#00C896]" },
  ],
};

const MODES = [
  {
    id: "trip",
    title: "Full Trip",
    tagline: "Multi-day · multi-activity",
    desc: "Flights, hotels, food, scuba, cabs — all under one roof.",
    examples: ["✈ Flights", "🏨 Stay", "🍽 Dining", "🤿 Activities"],
    icon: Plane,
    gradient: "from-[#6C47FF] to-[#FF6B6B]",
    ring: "ring-[#6C47FF]/40",
    accent: "text-[#B8A6FF]",
  },
  {
    id: "dayout",
    title: "Day Out",
    tagline: "Short trip · single day",
    desc: "Waterpark, road trip, picnic — a handful of expenses to split.",
    examples: ["🎟 Tickets", "🚗 Fuel", "🍔 Snacks"],
    icon: Sun,
    gradient: "from-[#FFB347] to-[#FF6B6B]",
    ring: "ring-[#FFB347]/40",
    accent: "text-[#FFD89B]",
  },
  {
    id: "bite",
    title: "Quick Bite",
    tagline: "One bill · split now",
    desc: "Just dinner with friends? Snap the receipt, split, done.",
    examples: ["🧾 One receipt", "⚡ 30 sec split"],
    icon: UtensilsCrossed,
    gradient: "from-[#00C896] to-[#6C47FF]",
    ring: "ring-[#00C896]/40",
    accent: "text-[#7FE6C8]",
  },
] as const;

function Dashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"type" | "activity">("type");
  const [pickedType, setPickedType] = useState<(typeof MODES)[number] | null>(null);

  const openCreate = () => {
    setStep("type");
    setPickedType(null);
    setOpen(true);
  };

  const pickType = (m: (typeof MODES)[number]) => {
    setPickedType(m);
    setStep("activity");
  };

  const pickActivity = () => {
    setOpen(false);
    navigate({ to: "/app/add-expense" });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back, Arjun</p>
          <h1 className="text-2xl font-bold">What are we splitting?</h1>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-pill bg-gradient-primary text-sm font-bold text-primary-foreground shadow-glow">
          A
        </div>
      </header>

      {/* Create Split CTA */}
      <button
        onClick={openCreate}
        className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#6C47FF] to-[#FF6B6B] p-5 text-left shadow-glow-lg transition-smooth hover:shadow-glow"
      >
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Wand2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-white">Create a Split</p>
            <p className="text-xs text-white/80">Choose split type → pick activity</p>
          </div>
        </div>
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-pill bg-white/20 backdrop-blur">
          <Plus className="h-5 w-5 text-white" />
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
      </button>


      {/* AI suggest banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-[#1C1B29] via-[#241B3A] to-[#1C1B29] p-5 shadow-glow">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">ChipIn AI suggests</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You opened the app near <span className="text-foreground">Indiranagar</span> — heading
              for dinner? Start a <span className="text-[#7FE6C8]">Quick Bite</span> split.
            </p>
          </div>
        </div>
      </div>

      {/* Mode picker */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">Pick your mode</h2>
          <span className="text-xs text-muted-foreground">3 ways to split</span>
        </div>

        <div className="space-y-3">
          {MODES.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => { openCreate(); pickType(m); }}
                className={`group relative block w-full text-left overflow-hidden rounded-2xl border border-border bg-card p-5 transition-smooth hover:ring-2 ${m.ring} hover:border-transparent`}
              >
                {/* gradient halo */}
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${m.gradient} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`}
                />
                <div className="relative flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${m.gradient} shadow-glow`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-foreground">{m.title}</p>
                      <ArrowRight className={`h-4 w-4 ${m.accent} transition-transform group-hover:translate-x-1`} />
                    </div>
                    <p className={`text-xs font-medium ${m.accent}`}>{m.tagline}</p>
                    <p className="mt-1.5 text-sm text-muted-foreground">{m.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.examples.map((e) => (
                        <span
                          key={e}
                          className="rounded-pill border border-border bg-background/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Active trips */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">Continue where you left off</h2>
          <Link to="/app/balances" className="text-xs text-primary">
            View all
          </Link>
        </div>
        {[
          { id: "1", name: "Bali 2025", sub: "Full trip · 5 members", balance: "+₹82,000", positive: true, emoji: "🌴" },
          { id: "2", name: "Wonderla day out", sub: "Day out · 4 members", balance: "−₹450", positive: false, emoji: "🎢" },
          { id: "3", name: "Toit dinner", sub: "Quick bite · 3 members", balance: "+₹620", positive: true, emoji: "🍻" },
        ].map((t) => (
          <Link
            key={t.id}
            to="/app/trip/$id"
            params={{ id: t.id }}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-smooth hover:border-primary/40 hover:shadow-glow"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background text-xl">
                {t.emoji}
              </div>
              <div>
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.sub}</p>
              </div>
            </div>
            <span className={`text-sm font-bold ${t.positive ? "text-[#00C896]" : "text-[#FF4757]"}`}>
              {t.balance}
            </span>
          </Link>
        ))}
      </section>

      {/* Custom CTA */}
      <Link
        to="/app/add-expense"
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/50 p-4 text-sm font-medium text-muted-foreground transition-smooth hover:border-primary/50 hover:text-foreground"
      >
        <Plus className="h-4 w-4" /> Start something custom
      </Link>
    </div>
  );
}
