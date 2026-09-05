import { PhoneFrame } from "@/components/landing/ui/PhoneFrame";
import { cn } from "@/lib/utils";

export function PhoneScreen({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PhoneFrame className={cn("w-[240px] sm:w-[268px]", className)}>{children}</PhoneFrame>
  );
}

export function PhoneStatusBar() {
  return (
    <div className="flex items-center justify-between font-sans text-[10px] text-ink">
      <span className="num font-medium">9:41</span>
      <div className="flex items-center gap-1.5" aria-hidden>
        <svg viewBox="0 0 16 12" className="h-2.5 w-3.5" fill="currentColor">
          <path d="M1 8.5c2.4-2.6 5.6-4 7-4s4.6 1.4 7 4l-1.3 1.2C12.2 7.4 9.8 6.4 8 6.4S3.8 7.4 2.3 9.7L1 8.5Z" />
          <path d="M4.2 9.8C5.5 8.4 6.8 7.7 8 7.7s2.5.7 3.8 2.1L8 14 4.2 9.8Z" opacity="0.55" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-2.5 w-3.5" fill="currentColor">
          <path d="M1.2 10.2 8 2.8l6.8 7.4-1.4 1.2L8 5.6 2.6 11.4 1.2 10.2Z" />
        </svg>
        <svg viewBox="0 0 24 12" className="h-2.5 w-5">
          <rect x="0.6" y="1" width="18" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <rect x="2" y="2.5" width="13.5" height="7" rx="1" fill="currentColor" />
          <rect x="19.5" y="3.5" width="1.8" height="5" rx="0.6" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

export function MockCard({
  children,
  className,
  ring,
}: {
  children: React.ReactNode;
  className?: string;
  ring?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgba(11,27,43,0.06)]",
        ring && "ring-2 ring-rust/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MockStars({ filled, of = 5 }: { filled: number; of?: number }) {
  return (
    <span className="inline-flex items-center gap-px" aria-hidden>
      {Array.from({ length: of }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 16 16"
          className={cn("h-3 w-3", i < filled ? "text-rust" : "text-line")}
        >
          <path
            d="M8 1.2 9.9 5.6l4.8.4-3.7 3.1 1.1 4.6L8 11.4 4 13.7l1.1-4.6L1.4 6l4.8-.4Z"
            fill="currentColor"
          />
        </svg>
      ))}
    </span>
  );
}
