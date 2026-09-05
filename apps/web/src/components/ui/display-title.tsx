import { cn } from "@/lib/utils";

type Props = {
  as?: "h1" | "h2" | "h3";
  size?: "display-1" | "display-2" | "display-3" | "sm";
  children: React.ReactNode;
  className?: string;
  id?: string;
};

const sizeClasses = {
  "display-1": "text-[clamp(2.75rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.03em]",
  "display-2": "text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-[-0.025em]",
  "display-3": "text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] tracking-[-0.02em]",
  sm: "leading-tight tracking-tight",
};

export function DisplayTitle({ as: Tag = "h2", size = "display-2", children, className, id }: Props) {
  return (
    <Tag
      id={id}
      className={cn("font-display font-display-soft font-bold text-ink", sizeClasses[size], className)}
    >
      {children}
    </Tag>
  );
}

export function Accent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <em className={cn("font-display italic", className ?? "text-rust")}>{children}</em>
  );
}
