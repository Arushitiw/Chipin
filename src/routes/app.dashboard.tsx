import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sparkles, Plane, Sun, UtensilsCrossed, ArrowRight, Plus, Wand2, Wrench,
} from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { CURRENCIES, type Trip, createTrip } from "@/lib/trips";
import { fetchTrips } from "@/lib/api";
import {
  EmptyState, ErrorState, ShimmerCard, SuitcaseIcon,
} from "@/components/states";

export const Route = createFileRoute("/app/dashboard")({
  component: Dashboard,
});

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
    placeholder: "e.g. Bali 2025",
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
    placeholder: "e.g. Wonderla Sunday",
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
    placeholder: "e.g. Toit dinner",
  },
  {
    id: "custom",
    title: "Custom",
    tagline: "Your rules · your name",
    desc: "Name it whatever you want and add expenses your way.",
    examples: ["✨ Anything goes", "📝 Free-form"],
    icon: Wrench,
    gradient: "from-[#A78BFF] to-[#00C896]",
    ring: "ring-[#A78BFF]/40",
    accent: "text-[#C9B6FF]",
    placeholder: "e.g. Roomies May",
  },
] as const;

function Dashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"type" | "name">("type");
  const [pickedType, setPickedType] = useState<(typeof MODES)[number] | null>(null);
  const [splitName, setSplitName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [maxMembers, setMaxMembers] = useState("");

  const openCreate = () => {
    setStep("type");
    setPickedType(null);
    setSplitName("");
    setStartDate("");
    setEndDate("");
    setCurrency("INR");
    setMaxMembers("");
    setOpen(true);
  };

  const pickType = (m: (typeof MODES)[number]) => {
    setPickedType(m);
    setSplitName("");
    setStep("name");
  };

  const confirmName = () => {
    if (!splitName.trim() || !pickedType) return;
    const trip = createTrip({
      name: splitName.trim(),
      type: pickedType.id,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      currency,
      maxMembers: maxMembers ? Number(maxMembers) : undefined,
    });
    setOpen(false);
    navigate({ to: "/app/trip/$id/invite", params: { id: trip.id } });
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
              </button>
            );
          })}
        </div>
      </section>

      <ActiveTrips onCreate={openCreate} />

      {/* Custom CTA */}

      {/* Custom CTA */}
      <Link
        to="/app/add-expense"
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/50 p-4 text-sm font-medium text-muted-foreground transition-smooth hover:border-primary/50 hover:text-foreground"
      >
        <Plus className="h-4 w-4" /> Start something custom
      </Link>

      {/* Create Split Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl border-border bg-[#1C1B29] p-0">
          <div className="mx-auto max-w-2xl p-6">
            <SheetHeader className="text-left">
              <SheetTitle className="text-xl text-foreground">
                {step === "type" ? "What type of split?" : `Name your ${pickedType?.title.toLowerCase()}`}
              </SheetTitle>
              <SheetDescription>
                {step === "type"
                  ? "Choose how big this is — we'll tailor the flow."
                  : "Call it whatever you want. You can add anything inside."}
              </SheetDescription>
            </SheetHeader>

            {step === "type" && (
              <div className="mt-5 space-y-3">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => pickType(m)}
                      className={`flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-smooth hover:ring-2 ${m.ring}`}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${m.gradient} shadow-glow`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">{m.title}</p>
                        <p className={`text-xs ${m.accent}`}>{m.tagline}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            )}

            {step === "name" && pickedType && (
              <>
                <div className="mt-5 space-y-4">
                  <div className={`flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-4`}>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${pickedType.gradient} shadow-glow`}>
                      <pickedType.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{pickedType.title}</p>
                      <p className={`text-xs ${pickedType.accent}`}>{pickedType.tagline}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Split name</label>
                    <Input
                      autoFocus
                      value={splitName}
                      onChange={(e) => setSplitName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") confirmName(); }}
                      placeholder={pickedType.placeholder}
                      className="h-12 rounded-xl border-border bg-[#252438] text-base text-foreground placeholder:text-muted-foreground"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      You can add anything inside — flights, dinner, tickets, whatever.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Start date</label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-11 rounded-xl border-border bg-[#252438] text-sm text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">End date</label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-11 rounded-xl border-border bg-[#252438] text-sm text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Base currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="h-11 w-full rounded-xl border border-border bg-[#252438] px-3 text-sm text-foreground"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} — {c.name} ({c.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Max members <span className="text-muted-foreground/60">(optional)</span>
                    </label>
                    <Input
                      type="number"
                      min={2}
                      value={maxMembers}
                      onChange={(e) => setMaxMembers(e.target.value)}
                      placeholder="No cap"
                      className="h-11 rounded-xl border-border bg-[#252438] text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <button
                    onClick={confirmName}
                    disabled={!splitName.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C47FF] to-[#FF6B6B] p-3.5 text-sm font-bold text-white shadow-glow transition-smooth disabled:opacity-40 disabled:shadow-none"
                  >
                    Create & add expenses <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => setStep("type")}
                  className="mt-4 w-full rounded-xl border border-border bg-background/40 p-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Change split type
                </button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

const TYPE_EMOJI: Record<string, string> = {
  trip: "🌴", dayout: "🎢", bite: "🍻", custom: "✨",
};

function ActiveTrips({ onCreate }: { onCreate: () => void }) {
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setError(null);
    setTrips(null);
    fetchTrips()
      .then(setTrips)
      .catch(() => setError("Couldn't load your trips"));
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Continue where you left off</h2>
        <Link to="/app/balances" className="text-xs text-primary">View all</Link>
      </div>

      {trips === null && !error && (
        <div className="space-y-2">
          <ShimmerCard className="h-16" />
          <ShimmerCard className="h-16" />
        </div>
      )}

      {error && <ErrorState message={error} onRetry={load} />}

      {trips && trips.length === 0 && (
        <EmptyState
          icon={<SuitcaseIcon />}
          title="No trips yet"
          subtitle="Create your first trip and invite your friends"
          action={
            <button
              onClick={onCreate}
              className="mt-2 inline-flex items-center gap-2 rounded-pill bg-gradient-to-r from-[#6C47FF] to-[#FF6B6B] px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
            >
              <Plus className="h-4 w-4" /> Create a Trip
            </button>
          }
        />
      )}

      {trips && trips.map((t) => (
        <Link
          key={t.id}
          to="/app/trip/$id"
          params={{ id: t.id }}
          className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-smooth hover:border-primary/40 hover:shadow-glow"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background text-xl">
              {TYPE_EMOJI[t.type] || "🧾"}
            </div>
            <div>
              <p className="font-semibold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">
                {t.members.length} member{t.members.length === 1 ? "" : "s"} · {t.currency}
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">Open →</span>
        </Link>
      ))}
    </section>
  );
}
