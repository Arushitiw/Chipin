// Local "API" for trip invite system.
// Persists in localStorage; broadcasts member:joined across tabs via BroadcastChannel.

export type Currency = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
};

export const CURRENCIES: Currency[] = [
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
];

export type Member = { name: string; joinedAt: number };

export type Trip = {
  id: string;
  name: string;
  type: string;
  startDate?: string;
  endDate?: string;
  currency: string;
  maxMembers?: number;
  createdBy: string;
  createdAt: number;
  inviteCode: string;
  inviteExpiresAt: number;
  members: Member[];
};

const KEY = "chipin:trips";
const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function read(): Trip[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(trips: Trip[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(trips));
}

function randomCode(len = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++)
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

export function createTrip(input: {
  name: string;
  type: string;
  startDate?: string;
  endDate?: string;
  currency: string;
  maxMembers?: number;
  createdBy?: string;
}): Trip {
  const trips = read();
  const trip: Trip = {
    id: randomId(),
    name: input.name,
    type: input.type,
    startDate: input.startDate,
    endDate: input.endDate,
    currency: input.currency,
    maxMembers: input.maxMembers,
    createdBy: input.createdBy || "Arjun",
    createdAt: Date.now(),
    inviteCode: randomCode(),
    inviteExpiresAt: Date.now() + INVITE_TTL_MS,
    members: [{ name: input.createdBy || "Arjun", joinedAt: Date.now() }],
  };
  trips.unshift(trip);
  write(trips);
  return trip;
}

export function getTrip(id: string): Trip | null {
  return read().find((t) => t.id === id) || null;
}

export function getTripByInvite(code: string): Trip | null {
  const t = read().find((t) => t.inviteCode === code);
  if (!t) return null;
  if (Date.now() > t.inviteExpiresAt) return null;
  return t;
}

export function joinTrip(
  code: string,
  userName: string,
): { ok: true; trip: Trip } | { ok: false; error: string } {
  const trips = read();
  const idx = trips.findIndex((t) => t.inviteCode === code);
  if (idx === -1) return { ok: false, error: "Invite not found" };
  const t = trips[idx];
  if (Date.now() > t.inviteExpiresAt)
    return { ok: false, error: "Invite has expired" };
  if (t.maxMembers && t.members.length >= t.maxMembers)
    return { ok: false, error: "Trip is full" };
  if (t.members.some((m) => m.name.toLowerCase() === userName.toLowerCase())) {
    return { ok: true, trip: t };
  }
  t.members.push({ name: userName, joinedAt: Date.now() });
  trips[idx] = t;
  write(trips);
  broadcastJoin(t.id, userName);
  return { ok: true, trip: t };
}

export function regenerateInvite(id: string): Trip | null {
  const trips = read();
  const idx = trips.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  trips[idx].inviteCode = randomCode();
  trips[idx].inviteExpiresAt = Date.now() + INVITE_TTL_MS;
  write(trips);
  return trips[idx];
}

// --- realtime via BroadcastChannel ---

const CHANNEL = "chipin:events";
type JoinEvent = { type: "member:joined"; tripId: string; name: string };

export function broadcastJoin(tripId: string, name: string) {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
  const bc = new BroadcastChannel(CHANNEL);
  bc.postMessage({ type: "member:joined", tripId, name } satisfies JoinEvent);
  bc.close();
}

export function subscribeJoins(handler: (e: JoinEvent) => void) {
  if (typeof window === "undefined" || !("BroadcastChannel" in window))
    return () => {};
  const bc = new BroadcastChannel(CHANNEL);
  bc.onmessage = (msg) => {
    if (msg.data?.type === "member:joined") handler(msg.data);
  };
  return () => bc.close();
}

export function inviteUrl(code: string) {
  if (typeof window === "undefined") return `chipin.app/join/${code}`;
  return `${window.location.origin}/join/${code}`;
}

export function inviteExpiryLabel(expiresAt: number): string {
  const ms = expiresAt - Date.now();
  if (ms <= 0) return "Expired";
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (days > 0) return `Expires in ${days}d ${hours}h`;
  return `Expires in ${hours}h`;
}
