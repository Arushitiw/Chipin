import { Link } from "@tanstack/react-router";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <span className="text-lg font-bold text-primary-foreground">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">ChipIn</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground">
            Features
          </a>
          <a href="#how" className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground">
            How it works
          </a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground">
            Pricing
          </a>
        </nav>

        <Link
          to="/app/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-pill bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:shadow-glow-lg"
        >
          Open app
        </Link>
      </div>
    </header>
  );
}
