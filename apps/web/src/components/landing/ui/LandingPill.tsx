export function LandingPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-2 px-4 py-2 text-sm font-medium uppercase tracking-wide text-ink">
      {children}
    </span>
  );
}
