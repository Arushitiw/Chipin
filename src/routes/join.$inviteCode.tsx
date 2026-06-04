import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Users, AlertTriangle, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  getTripByInvite, joinTrip, CURRENCIES, type Trip,
} from "@/lib/trips";

export const Route = createFileRoute("/join/$inviteCode")({
  component: JoinPage,
});

function JoinPage() {
  const { inviteCode } = Route.useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);

  // Pretend logged-in user (if any) — read from localStorage
  const loggedInName = typeof window !== "undefined"
    ? localStorage.getItem("chipin:userName") || ""
    : "";

  useEffect(() => {
    const t = getTripByInvite(inviteCode);
    setTrip(t);
    if (loggedInName) setName(loggedInName);
    setLoaded(true);
  }, [inviteCode, loggedInName]);

  if (!loaded) return null;

  if (!trip) {
    return (
      <div className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-[#FF4757]/30 bg-[#1C1B29] p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FF4757]/15">
              <AlertTriangle className="h-6 w-6 text-[#FF4757]" />
            </div>
            <h1 className="mt-4 text-xl font-bold text-foreground">Invite link invalid</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This invite link is invalid or has expired. Ask the trip creator for a new one.
            </p>
            <Link to="/" className="mt-5 inline-block text-sm text-primary">← Back home</Link>
          </div>
        </div>
      </div>
    );
  }

  const currency = CURRENCIES.find((c) => c.code === trip.currency);
  const dates = trip.startDate && trip.endDate
    ? `${fmt(trip.startDate)} – ${fmt(trip.endDate)}`
    : trip.startDate ? fmt(trip.startDate) : "No dates set";

  const handleJoin = () => {
    if (!name.trim()) {
      toast.error("Enter your name to continue");
      return;
    }
    setJoining(true);
    const res = joinTrip(inviteCode, name.trim());
    if (!res.ok) {
      toast.error(res.error);
      setJoining(false);
      return;
    }
    if (typeof window !== "undefined" && !loggedInName) {
      localStorage.setItem("chipin:userName", name.trim());
    }
    toast.success(`Welcome to ${res.trip.name} 🎉`);
    navigate({ to: "/app/trip/$id", params: { id: res.trip.id } });
  };

  const full = trip.maxMembers && trip.members.length >= trip.maxMembers;

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-md space-y-5">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-pill bg-gradient-to-r from-[#6C47FF] to-[#FF6B6B] px-3 py-1 text-xs font-bold text-white shadow-glow">
            ChipIn
          </div>
          <h1 className="mt-3 text-2xl font-bold text-foreground">You're invited!</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {trip.createdBy} wants you to split expenses together.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-[#1C1B29] p-5">
          <h2 className="text-xl font-bold text-foreground">{trip.name}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Created by {trip.createdBy}</p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-border bg-[#252438] p-3">
              <p className="text-muted-foreground">Dates</p>
              <p className="mt-1 flex items-center gap-1 font-semibold text-foreground">
                <CalendarDays className="h-3.5 w-3.5" /> {dates}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-[#252438] p-3">
              <p className="text-muted-foreground">Currency</p>
              <p className="mt-1 font-semibold text-foreground">{currency?.flag} {trip.currency}</p>
            </div>
            <div className="col-span-2 rounded-xl border border-border bg-[#252438] p-3">
              <p className="text-muted-foreground">Members joined</p>
              <p className="mt-1 flex items-center gap-1 font-semibold text-foreground">
                <Users className="h-3.5 w-3.5" /> {trip.members.length}
                {trip.maxMembers ? ` of ${trip.maxMembers}` : ""}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {trip.members.map((m) => (
                  <span key={m.name} className="rounded-pill border border-border bg-background/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {full ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            This trip is full ({trip.maxMembers} members).
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-[#1C1B29] p-5 space-y-3">
            <label className="text-xs font-medium text-muted-foreground">
              {loggedInName ? "Joining as" : "Enter your name to join as guest"}
            </label>
            <Input
              autoFocus={!loggedInName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleJoin(); }}
              placeholder="Your name"
              className="h-12 rounded-xl border-border bg-[#252438] text-base text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={handleJoin}
              disabled={joining || !name.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C47FF] to-[#FF6B6B] p-3.5 text-sm font-bold text-white shadow-glow transition-smooth disabled:opacity-40"
            >
              Join Trip <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch { return iso; }
}
