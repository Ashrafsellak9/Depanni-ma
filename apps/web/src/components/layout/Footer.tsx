import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-navy text-navy-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div>
            <p className="text-lg font-bold">
              DEPANNI<span className="text-primary">.ma</span>
            </p>
            <p className="mt-2 max-w-sm text-sm text-white/70">
              La plateforme marocaine de dépannage et services à domicile. Artisans vérifiés, paiement
              sécurisé.
            </p>
          </div>
          <div className="flex gap-8 text-sm">
            <div className="space-y-2">
              <p className="font-semibold">Plateforme</p>
              <Link href="/comment-ca-marche" className="block text-white/70 hover:text-white">
                Comment ça marche
              </Link>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Compte</p>
              <Link href="/login" className="block text-white/70 hover:text-white">
                Connexion
              </Link>
              <Link href="/register" className="block text-white/70 hover:text-white">
                Inscription
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} DEPANNI.ma — Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
