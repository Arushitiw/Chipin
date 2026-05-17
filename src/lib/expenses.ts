// Local expense store. Stand-in for a real backend; persisted in localStorage.

export type Expense = {
  id: string;
  tripId: string;
  category: string; // e.g. "Flights", "Hotel", "Food"
  emoji?: string;
  name: string;
  amount: number; // base currency units
  paidBy: string; // member name
  createdAt: number;
};

const KEY = "chipin:expenses";

function read(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(rows: Expense[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(rows));
}

export function listExpenses(tripId: string): Expense[] {
  return read().filter((e) => e.tripId === tripId);
}

export function addExpense(input: Omit<Expense, "id" | "createdAt">): Expense {
  const all = read();
  const row: Expense = {
    ...input,
    id: Math.random().toString(36).slice(2, 10),
    createdAt: Date.now(),
  };
  all.unshift(row);
  write(all);
  return row;
}
