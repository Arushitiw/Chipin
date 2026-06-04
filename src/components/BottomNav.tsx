import { Link, useLocation } from "@tanstack/react-router";
import { Home, BarChart3, User, Plus } from "lucide-react";

const items = [
  { to: "/app/dashboard", label: "Home", icon: Home },
  { to: "/app/balances", label: "Balances", icon: BarChart3 },
  { to: "/app/report", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-lg">
      <div className="relative mx-auto flex h-20 max-w-2xl items-center justify-around px-6">
        {/* Home */}
        <NavItem item={items[0]} active={pathname === items[0].to} />

        {/* Add (gradient circle) */}
        <Link
          to="/app/add-expense"
          aria-label="Add expense"
          className="relative -mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-glow-lg transition-smooth hover:scale-105"
        >
          <Plus className="h-7 w-7 text-primary-foreground" strokeWidth={2.5} />
        </Link>

        {/* Balances */}
        <NavItem item={items[1]} active={pathname.startsWith(items[1].to)} />

        {/* Profile */}
        <NavItem item={items[2]} active={pathname.startsWith(items[2].to)} />
      </div>
    </nav>
  );
}

function NavItem({
  item,
  active,
}: {
  item: { to: string; label: string; icon: typeof Home };
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={`flex flex-col items-center gap-1 text-xs font-medium transition-smooth ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className={`h-6 w-6 ${active ? "text-primary" : ""}`} />
      <span>{item.label}</span>
    </Link>
  );
}
