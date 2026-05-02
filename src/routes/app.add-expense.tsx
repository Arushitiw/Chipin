import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/add-expense")({
  component: AddExpense,
});

function AddExpense() {
  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <Link
          to="/app/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-card text-muted-foreground transition-smooth hover:text-foreground"
        >
          ←
        </Link>
        <h1 className="text-2xl font-bold">Add expense</h1>
      </header>

      <form className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">Description</label>
          <input
            type="text"
            placeholder="Dinner, taxi, groceries…"
            className="h-12 w-full rounded-md border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">Amount</label>
          <input
            type="number"
            placeholder="0.00"
            className="h-12 w-full rounded-md border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">Paid by</label>
          <select className="h-12 w-full rounded-md border border-border bg-card px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option>You</option>
            <option>Maya</option>
            <option>Jordan</option>
          </select>
        </div>

        <button
          type="button"
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-pill bg-gradient-primary text-base font-semibold text-primary-foreground shadow-glow transition-smooth hover:shadow-glow-lg"
        >
          Save expense
        </button>
      </form>
    </div>
  );
}
