import Link from "next/link";

import { AppStoreBadge, GooglePlayBadge } from "@/components/ui/store-badges";
import { HOW_IT_WORKS_ARTISAN_TAB } from "@/lib/siteConstants";

function SocialGlyph({ name }: { name: "Facebook" | "Instagram" | "WhatsApp" | "LinkedIn" | "TikTok" }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-[18px] w-[18px]",
    "aria-hidden": true,
  };

  if (name === "Facebook") {
    return (
      <svg {...common}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  if (name === "Instagram") {
    return (
      <svg {...common}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  if (name === "WhatsApp") {
    return (
      <svg {...common}>
        <path d="M20.2 11.6A8.2 8.2 0 0 1 8 19.1L4 20.1l1.1-3.9A8.2 8.2 0 1 1 20.2 11.6Z" />
        <path d="M9.2 8.7c.2-.6.4-.6.7-.6h.4c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.2.6l-.4.4c-.1.2-.1.4.1.6.4.6 1 1.1 1.6 1.5.2.1.4.1.5 0l.5-.4c.2-.1.4-.1.6 0l1.5.7c.2.1.3.3.3.5v.5c0 .3 0 .5-.6.7A5 5 0 0 1 12 16.4 5.2 5.2 0 0 1 8.8 9.2c.1-.3.2-.5.4-.5Z" />
      </svg>
    );
  }
  if (name === "LinkedIn") {
    return (
      <svg {...common}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M14 3.5v9.3a3.7 3.7 0 1 1-3.2-3.67" />
      <path d="M14 8.2A6.4 6.4 0 0 0 19.4 10" />
    </svg>
  );
}

function MoroccoFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden>
      <rect width="24" height="16" fill="#C1272D" rx="1" />
      <path
        d="M12 3.4 13.2 7h3.7l-3 2.2 1.1 3.6L12 10.9 8.99 12.8 10.1 9.2 7.1 7h3.7Z"
        fill="none"
        stroke="#006233"
        strokeWidth="1.15"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Facebook" as const, href: "https://facebook.com" },
  { label: "Instagram" as const, href: "https://instagram.com" },
  { label: "WhatsApp" as const, href: "https://wa.me/212522000000" },
  { label: "LinkedIn" as const, href: "https://linkedin.com" },
  { label: "TikTok" as const, href: "https://tiktok.com" },
];

const SERVICE_LINKS = ["Plomberie", "Électricité", "Serrurerie", "Mécanique", "Peinture"];
const ARTISAN_LINKS = [
  { href: HOW_IT_WORKS_ARTISAN_TAB, label: "Devenir artisan" },
  { href: "/tarifs?tab=artisan", label: "Tarifs & abonnements" },
  { href: "#artisans", label: "Avantages artisans" },
];
const COMPANY_LINKS = [
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "/contact", label: "Contact" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgu", label: "CGU" },
  { href: "/politique-confidentialite", label: "Confidentialité" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="landing-container grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        <div>
          <Link href="/" className="inline-block" aria-label="DEPANNI.ma, accueil">
            <span className="font-display text-2xl font-bold text-white">DEPANNI</span>
            <span className="font-sans text-lg font-medium text-sand">.ma</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            La marketplace marocaine des services à domicile. Artisans vérifiés, offres en temps
            réel, paiement sécurisé.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <AppStoreBadge variant="dark" />
            <GooglePlayBadge variant="dark" />
          </div>
          <ul className="mt-6 flex items-center gap-2">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`DEPANNI.ma sur ${s.label}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/8 text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-rust"
                >
                  <SocialGlyph name={s.label} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-5 text-xs font-medium uppercase tracking-widest text-white/70">Services</p>
          <ul className="space-y-3 text-sm">
            {SERVICE_LINKS.map((label) => (
              <li key={label}>
                <Link href="/#services" className="underline-grow transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-5 text-xs font-medium uppercase tracking-widest text-white/70">Artisans</p>
          <ul className="space-y-3 text-sm">
            {ARTISAN_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="underline-grow transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-5 text-xs font-medium uppercase tracking-widest text-white/70">Entreprise</p>
          <ul className="space-y-3 text-sm">
            {COMPANY_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="underline-grow transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t border-white/8 pt-8">
        <div className="landing-container flex flex-col items-center justify-between gap-4 pb-8 text-sm md:flex-row">
          <p>© {new Date().getFullYear()} DEPANNI.ma — Tous droits réservés</p>
          <Link
            href="/statut"
            className="text-xs text-white/40 transition-colors hover:text-white/70"
          >
            Statut du service
          </Link>
          <p className="flex items-center gap-2 font-medium text-white/80">
            <MoroccoFlag className="h-3.5 w-5" />
            Fièrement marocain
          </p>
        </div>
      </div>
    </footer>
  );
}
