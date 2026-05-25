import Link from "next/link";

const SERVICE_LINKS = ["Plomberie", "Électricité", "Serrurerie", "Mécanique", "Peinture"];
const ARTISAN_LINKS = [
  { href: "/artisan/register", label: "Devenir artisan" },
  { href: "/prix", label: "Tarifs & abonnements" },
  { href: "#artisans", label: "Avantages artisans" },
];
const COMPANY_LINKS = [
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "#", label: "Contact" },
  { href: "#", label: "Mentions légales" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white/70">
      <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="lg:col-span-1">
          <Link href="/" className="font-syne text-2xl font-extrabold text-white">
            DEPANNI<span className="text-orange">.ma</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            La marketplace marocaine des services à domicile. Artisans vérifiés, offres en temps
            réel, paiement sécurisé.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Services</h4>
          <ul className="space-y-2 text-sm">
            {SERVICE_LINKS.map((label) => (
              <li key={label}>
                <Link href="#services" className="transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Artisans</h4>
          <ul className="space-y-2 text-sm">
            {ARTISAN_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Entreprise</h4>
          <ul className="space-y-2 text-sm">
            {COMPANY_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-6 text-sm md:flex-row">
          <p>© {new Date().getFullYear()} DEPANNI.ma — Tous droits réservés</p>
          <p className="font-medium text-white/90">🇲🇦 Fièrement marocain</p>
        </div>
      </div>
    </footer>
  );
}
