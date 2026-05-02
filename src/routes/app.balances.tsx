import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/balances")({
  component: Balances,
});

function Balances() {
  const balances = [
    { name: "Maya", amount: 84.0, owes: false },
    { name: "Jordan", amount: 40.5, owes: false },
    { name: "Sam", amount: 22.75, owes: true },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Balances</h1>
        <p className="text-sm text-muted-foreground">Who owes who, settled simply.</p>
      </header>

      <div className="rounded-lg bg-gradient-primary p-6 shadow-glow-lg">
        <p className="text-sm font-medium text-primary-foreground/80">Net balance</p>
        <p className="mt-1 text-4xl font-bold text-primary-foreground">+$101.75</p>
      </div>

      <div className="space-y-3">
        {balances.map((b) => (
          <div
            key={b.name}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-pill bg-card-2 font-semibold">
                {b.name[0]}
              </div>
              <div>
                <p className="font-medium">{b.name}</p>
                <p className="text-xs text-muted-foreground">
                  {b.owes ? "You owe" : "Owes you"}
                </p>
              </div>
            </div>
            <span className={`font-semibold ${b.owes ? "text-destructive" : "text-success"}`}>
              {b.owes ? "-" : "+"}${b.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
