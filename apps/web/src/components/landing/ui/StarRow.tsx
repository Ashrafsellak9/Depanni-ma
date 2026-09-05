import { cn } from "@/lib/utils";

export function StarRow({
  label = "Note 5 étoiles sur 5",
  className,
  starClassName = "h-3.5 w-3.5",
}: {
  label?: string;
  className?: string;
  starClassName?: string;
}) {
  return (
    <span className={cn("inline-flex gap-px text-rust", className)} aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 16 16" className={starClassName} aria-hidden>
          <path
            d={
              i % 2 === 0
                ? "M8 1.2 9.9 5.6l4.8.4-3.7 3.1 1.1 4.6L8 11.4 4 13.7l1.1-4.6L1.4 6l4.8-.4Z"
                : "M8 1.4 9.7 5.5l4.6.5-3.5 2.9 1 4.4L8 11.2 4.2 13.3l1-4.4L1.7 6l4.6-.5Z"
            }
            fill="currentColor"
          />
        </svg>
      ))}
    </span>
  );
}
