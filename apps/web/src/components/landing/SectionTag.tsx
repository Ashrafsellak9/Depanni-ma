import { cn } from "@/lib/utils";

export function SectionTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full bg-orange/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-orange",
        className,
      )}
    >
      {children}
    </span>
  );
}
