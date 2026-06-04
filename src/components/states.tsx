import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function ShimmerCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-card ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center">
      <div className="text-3xl">⚠️</div>
      <p className="text-sm font-semibold text-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-pill bg-gradient-to-r from-[#6C47FF] to-[#FF6B6B] px-5 py-2 text-xs font-semibold text-white shadow-glow"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C47FF]/20 to-[#FF6B6B]/20 text-[#B8A6FF]">
        {icon}
      </div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      {subtitle && (
        <p className="max-w-sm text-sm text-muted-foreground">{subtitle}</p>
      )}
      {action}
    </div>
  );
}

export function GradientCTA({
  to,
  children,
  onClick,
}: {
  to?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const cls =
    "inline-flex items-center justify-center gap-2 rounded-pill bg-gradient-to-r from-[#6C47FF] to-[#FF6B6B] px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-smooth hover:opacity-95";
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

// Simple inline SVGs used by empty states.
export function SuitcaseIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ReceiptIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ScaleIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v18M5 21h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M6 7l-3 6h6l-3-6zM18 7l-3 6h6l-3-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
