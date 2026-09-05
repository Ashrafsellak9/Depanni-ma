import { avatarBgClass } from "@/lib/avatar";
import { cn } from "@/lib/utils";

export function InitialAvatar({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-sans text-sm font-semibold text-ink",
        avatarBgClass(initials),
        className,
      )}
    >
      {initials}
    </span>
  );
}
