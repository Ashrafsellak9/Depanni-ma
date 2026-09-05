import { cn } from "@/lib/utils";

export function SectionTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border border-line bg-paper-2 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-ink/70",
        className,
      )}
    >
      {children}
    </span>
  );
}
