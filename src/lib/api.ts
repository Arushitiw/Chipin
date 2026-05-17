// Centralised "API" layer. Uses axios with VITE_API_BASE_URL when available;
// gracefully falls back to the local trips/expenses stores so the app works
// before a backend is wired up.

import axios from "axios";
import {
  type Trip,
  getTrip as localGetTrip,
  // list helpers below
} from "@/lib/trips";
import { listExpenses, type Expense } from "@/lib/expenses";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

export type Settlement = { from: string; to: string; amount: number };
export type Balance = {
  name: string;
  paid: number;
  share: number;
  net: number;
};
export type CategoryTotal = { name: string; value: number; pct: number };
export type PersonTotal = { name: string; amount: number; pct: number };

// ---- local fallbacks (read from localStorage) ----

function readTrips(): Trip[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("chipin:trips") || "[]");
  } catch {
    return [];
  }
}

async function tryRemote<T>(path: string): Promise<T | null> {
  if (!baseURL) return null;
  try {
    const { data } = await api.get<T>(path);
    return data;
  } catch {
    return null;
  }
}

// ---- public API surface ----

export async function fetchTrips(): Promise<Trip[]> {
  const remote = await tryRemote<Trip[]>("/api/trips");
  return remote ?? readTrips();
}

export async function fetchTrip(id: string): Promise<Trip | null> {
  const remote = await tryRemote<Trip>(`/api/trips/${id}`);
  return remote ?? localGetTrip(id);
}

export async function fetchExpenses(tripId: string): Promise<Expense[]> {
  const remote = await tryRemote<Expense[]>(`/api/expenses/${tripId}`);
  return remote ?? listExpenses(tripId);
}

export async function fetchSettlements(tripId: string): Promise<{
  balances: Balance[];
  settlements: Settlement[];
  totalSpent: number;
}> {
  const remote = await tryRemote<{
    balances: Balance[];
    settlements: Settlement[];
    totalSpent: number;
  }>(`/api/settlements/${tripId}`);
  if (remote) return remote;

  // local computation
  const trip = localGetTrip(tripId);
  const expenses = listExpenses(tripId);
  if (!trip)
    return { balances: [], settlements: [], totalSpent: 0 };

  const members = trip.members.map((m) => m.name);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const sharePer = members.length ? totalSpent / members.length : 0;

  const paidByName = new Map<string, number>(members.map((n) => [n, 0]));
  for (const e of expenses) {
    paidByName.set(e.paidBy, (paidByName.get(e.paidBy) || 0) + e.amount);
  }

  const balances: Balance[] = members.map((name) => {
    const paid = paidByName.get(name) || 0;
    return { name, paid, share: sharePer, net: paid - sharePer };
  });

  // greedy settlements
  const creditors = balances
    .filter((b) => b.net > 0.01)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.net - a.net);
  const debtors = balances
    .filter((b) => b.net < -0.01)
    .map((b) => ({ ...b, net: -b.net }))
    .sort((a, b) => b.net - a.net);

  const settlements: Settlement[] = [];
  let i = 0,
    j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amt = Math.min(debtors[i].net, creditors[j].net);
    settlements.push({
      from: debtors[i].name,
      to: creditors[j].name,
      amount: Math.round(amt),
    });
    debtors[i].net -= amt;
    creditors[j].net -= amt;
    if (debtors[i].net < 0.01) i++;
    if (creditors[j].net < 0.01) j++;
  }

  return { balances, settlements, totalSpent };
}

export async function fetchReport(tripId: string): Promise<{
  totalSpent: number;
  categories: CategoryTotal[];
  people: PersonTotal[];
}> {
  const remote = await tryRemote<{
    totalSpent: number;
    categories: CategoryTotal[];
    people: PersonTotal[];
  }>(`/api/settlements/${tripId}/report`);
  if (remote) return remote;

  const trip = localGetTrip(tripId);
  const expenses = listExpenses(tripId);
  if (!trip) return { totalSpent: 0, categories: [], people: [] };

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  const byCat = new Map<string, number>();
  for (const e of expenses)
    byCat.set(e.category, (byCat.get(e.category) || 0) + e.amount);
  const categories: CategoryTotal[] = Array.from(byCat.entries())
    .map(([name, value]) => ({
      name,
      value,
      pct: totalSpent ? Math.round((value / totalSpent) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const byPerson = new Map<string, number>(
    trip.members.map((m) => [m.name, 0]),
  );
  for (const e of expenses)
    byPerson.set(e.paidBy, (byPerson.get(e.paidBy) || 0) + e.amount);
  const max = Math.max(1, ...Array.from(byPerson.values()));
  const people: PersonTotal[] = Array.from(byPerson.entries()).map(
    ([name, amount]) => ({
      name,
      amount,
      pct: Math.round((amount / max) * 100),
    }),
  );

  return { totalSpent, categories, people };
}
