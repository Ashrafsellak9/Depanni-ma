// TODO: remplacer par les vraies URLs App Store et Google Play quand l'app sera publiée
// https://developer.apple.com/app-store/marketing/guidelines/#downloadOnAppstore
// https://play.google.com/intl/en_us/badges/

const STORE_HREF = "#";

type BadgeVariant = "light" | "dark";

type StoreBadgeProps = {
  href?: string;
  variant?: BadgeVariant;
};

function badgeColors(variant: BadgeVariant) {
  const fill = variant === "dark" ? "#FFFFFF" : "#000000";
  const bg = variant === "dark" ? "#000000" : "#FFFFFF";
  const border = variant === "dark" ? "#FFFFFF" : "#000000";
  return { fill, bg, border };
}

export function AppStoreBadge({ href = STORE_HREF, variant = "light" }: StoreBadgeProps) {
  const { fill, bg, border } = badgeColors(variant);

  return (
    <a
      href={href}
      aria-label="Télécharger sur l'App Store"
      className="inline-flex h-[52px] items-center gap-3 rounded-xl px-5 transition-transform hover:translate-y-[-1px]"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
      <div className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-medium" style={{ color: fill }}>
          Télécharger dans
        </span>
        <span className="mt-0.5 text-[18px] font-semibold" style={{ color: fill }}>
          App Store
        </span>
      </div>
    </a>
  );
}

export function GooglePlayBadge({ href = STORE_HREF, variant = "light" }: StoreBadgeProps) {
  const { fill, bg, border } = badgeColors(variant);

  return (
    <a
      href={href}
      aria-label="Disponible sur Google Play"
      className="inline-flex h-[52px] items-center gap-3 rounded-xl px-5 transition-transform hover:translate-y-[-1px]"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <svg width="22" height="24" viewBox="0 0 22 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M.5 1.7C.2 2 0 2.4 0 3v18c0 .5.2 1 .5 1.3l10.7-10.7L.5 1.7z" fill="#00D7FE" />
        <path d="M15.5 8.3L3.8.5l-.4-.2c-.4-.1-.7-.1-1 0l11.4 11.4 1.7-3.4z" fill="#00F076" />
        <path d="M15.5 15.7L13.8 12.3 2.4 23.7c.3.1.6.1 1 0l.4-.2 11.7-7.8z" fill="#FE3944" />
        <path d="M21.7 10.6L17 7.9l-2.3 4 2.3 4 4.7-2.7c1.4-.8 1.4-2.8 0-3.6z" fill="#FFB700" />
      </svg>
      <div className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-medium" style={{ color: fill }}>
          Disponible sur
        </span>
        <span className="mt-0.5 text-[18px] font-semibold" style={{ color: fill }}>
          Google Play
        </span>
      </div>
    </a>
  );
}

export function StoreBadgePair({
  variant = "light",
  className,
}: {
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <div className={className ? `flex flex-wrap gap-3 ${className}` : "flex flex-wrap gap-3"}>
      <AppStoreBadge variant={variant} />
      <GooglePlayBadge variant={variant} />
    </div>
  );
}
