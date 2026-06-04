import { Link } from "@tanstack/react-router";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <svg className="h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">
            chip<span className="text-gradient-primary">·in</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#home" className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground">Home</a>
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground">Features</a>
          <a href="#how" className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground">How it works</a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground">Pricing</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/app/dashboard"
            className="hidden h-10 items-center justify-center rounded-pill border border-border bg-transparent px-5 text-sm font-semibold text-foreground transition-smooth hover:bg-card sm:inline-flex"
          >
            Login
          </Link>
          <Link
            to="/app/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-pill bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:shadow-glow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </header>
  );
}
