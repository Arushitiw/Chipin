import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Check, Copy, Mail, MessageCircle, ArrowRight, Link2, CalendarDays, Users,
} from "lucide-react";
import { getTrip, inviteUrl, inviteExpiryLabel, CURRENCIES, type Trip } from "@/lib/trips";

export const Route = createFileRoute("/app/trip/$id/invite")({
  component: InvitePage,
});

function InvitePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
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
  const currency = CURRENCIES.find((c) => c.code === trip.currency);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Copied!", { description: "Invite link is on your clipboard." });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy. Long-press the link to copy manually.");
    }
  };

  const waText = encodeURIComponent(`Join my trip ${trip.name} on ChipIn! ${link}`);
  const emailSubject = encodeURIComponent(`Join my trip ${trip.name} on ChipIn`);
  const emailBody = encodeURIComponent(
    `Hey!\n\nI'm splitting expenses for ${trip.name} on ChipIn.\nTap to join: ${link}\n`,
  );

  const dates = trip.startDate && trip.endDate
    ? `${fmt(trip.startDate)} – ${fmt(trip.endDate)}`
    : trip.startDate ? fmt(trip.startDate) : "No dates set";

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#6C47FF] via-[#8B5CFF] to-[#FF6B6B] p-6 shadow-glow-lg">
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-pill bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur">
            <Check className="h-3 w-3" /> Trip created
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">{trip.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/85">
            <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {dates}</span>
            <span className="inline-flex items-center gap-1">{currency?.flag} {trip.currency}</span>
            <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {trip.members.length}{trip.maxMembers ? ` / ${trip.maxMembers}` : ""}</span>
          </div>
        </div>
      </div>

      {/* Link box */}
      <div className="rounded-2xl border border-border bg-[#1C1B29] p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shareable link</p>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-[#252438] p-3">
          <Link2 className="h-4 w-4 shrink-0 text-[#B8A6FF]" />
          <span className="flex-1 truncate text-sm font-mono text-foreground">{displayLink}</span>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">{inviteExpiryLabel(trip.inviteExpiresAt)}</p>

        <button
          onClick={copyLink}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6C47FF] to-[#FF6B6B] p-3.5 text-sm font-bold text-white shadow-glow transition-smooth"
        >
          {copied ? (<><Check className="h-4 w-4" /> Copied!</>) : (<><Copy className="h-4 w-4" /> Copy Link</>)}
        </button>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <a
            href={`https://wa.me/?text=${waText}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-[#25D366]/10 p-3 text-sm font-semibold text-[#25D366] transition-smooth hover:bg-[#25D366]/20"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-3 text-sm font-semibold text-foreground transition-smooth hover:border-primary/50"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
        </div>
      </div>

      <button
        onClick={() => navigate({ to: "/app/trip/$id", params: { id: trip.id } })}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card p-3.5 text-sm font-semibold text-foreground transition-smooth hover:border-primary/50"
      >
        Go to Trip Dashboard <ArrowRight className="h-4 w-4" />
      </button>

      <Link
        to="/app/trip/$id/settings"
        params={{ id: trip.id }}
        className="block text-center text-xs text-muted-foreground hover:text-foreground"
      >
        Manage invite link & members →
      </Link>
    </div>
  );
}

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch { return iso; }
}
