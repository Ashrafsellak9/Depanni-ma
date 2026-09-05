import { cn } from "@/lib/utils";

export function AuthCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-[20px] border border-dep-border bg-white p-6 shadow-sm sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
