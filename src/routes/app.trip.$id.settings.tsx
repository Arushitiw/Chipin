import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RefreshCw, Clock, Users, AlertTriangle, Copy, Check } from "lucide-react";
import {
  getTrip, regenerateInvite, inviteUrl, inviteExpiryLabel, type Trip,
} from "@/lib/trips";

export const Route = createFileRoute("/app/trip/$id/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { id } = Route.useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setTrip(getTrip(id)); }, [id]);

  if (!trip) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">Trip not found.</p>
        <Link to="/app/dashboard" className="mt-3 inline-block text-sm text-primary">← Back to dashboard</Link>
      </div>
    );
  }

  const link = inviteUrl(trip.inviteCode);
  const displayLink = `chipin.app/join/${trip.inviteCode}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy");
    }
  };

  const regenerate = () => {
    const updated = regenerateInvite(trip.id);
    if (updated) {
      setTrip(updated);
      setConfirming(false);
      toast.success("New invite link generated", {
        description: "The previous link no longer works.",
      });
    }
  };

  const capLabel = trip.maxMembers
    ? `${trip.members.length} of ${trip.maxMembers} spots filled`
    : `${trip.members.length} members joined`;

  return (
    <div className="space-y-5">
      <header>
        <Link
          to="/app/trip/$id"
          params={{ id: trip.id }}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back to trip
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Trip settings</h1>
        <p className="text-sm text-muted-foreground">{trip.name}</p>
      </header>

      {/* Invite link */}
      <section className="rounded-2xl border border-border bg-[#1C1B29] p-5">
        <h2 className="text-sm font-semibold text-foreground">Invite link</h2>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-[#252438] p-3">
          <span className="flex-1 truncate text-sm font-mono text-foreground">{displayLink}</span>
          <button
            onClick={copyLink}
            className="rounded-lg border border-border bg-background/40 p-2 text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-4 w-4 text-[#00C896]" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-border bg-[#252438] p-3">
            <p className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Expiry
            </p>
            <p className="mt-1 font-semibold text-foreground">{inviteExpiryLabel(trip.inviteExpiresAt)}</p>
          </div>
          <div className="rounded-xl border border-border bg-[#252438] p-3">
            <p className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> Members
            </p>
            <p className="mt-1 font-semibold text-foreground">{capLabel}</p>
          </div>
        </div>

        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background/40 p-3 text-sm font-semibold text-foreground transition-smooth hover:border-[#FF6B6B]/50 hover:text-[#FF6B6B]"
          >
            <RefreshCw className="h-4 w-4" /> Regenerate Link
          </button>
        ) : (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" />
              <p className="text-xs text-amber-100">
                This will invalidate the current link. Anyone who hasn't joined yet will need the new one.
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="rounded-lg border border-border bg-background/40 p-2.5 text-xs font-semibold text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={regenerate}
                className="rounded-lg bg-gradient-to-r from-[#FF6B6B] to-[#6C47FF] p-2.5 text-xs font-bold text-white"
              >
                Yes, regenerate
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Members */}
      <section className="rounded-2xl border border-border bg-[#1C1B29] p-5">
        <h2 className="text-sm font-semibold text-foreground">Members</h2>
        <ul className="mt-3 space-y-2">
          {trip.members.map((m) => (
            <li key={m.name} className="flex items-center justify-between rounded-xl border border-border bg-[#252438] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-pill bg-gradient-primary text-xs font-bold text-primary-foreground">
                  {m.name[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground">{m.name}</span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {new Date(m.joinedAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
