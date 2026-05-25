import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

const SIZES: Record<AvatarSize, string> = {
  sm: "h-7 w-7 text-[11px] rounded-lg",
  md: "h-8 w-8 min-h-[32px] min-w-[32px] text-[11px] rounded-lg",
  lg: "h-10 w-10 text-xs rounded-xl",
};

export function AvatarCell({
  initials,
  color,
  size = "md",
}: {
  initials: string;
  color: string;
  size?: AvatarSize;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center font-bold text-white",
        SIZES[size],
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

