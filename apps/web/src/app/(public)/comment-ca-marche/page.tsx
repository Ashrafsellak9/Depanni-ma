import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment ça marche",
};

const steps = [
  {
    step: "1",
    title: "Décrivez votre besoin",
    body: "Créez une demande avec photos, adresse et niveau d'urgence.",
  },
  {
    step: "2",
    title: "Recevez des offres",
    body: "Les artisans qualifiés à proximité vous proposent un prix et un délai.",
  },
  {
    step: "3",
    title: "Choisissez et suivez",
    body: "Acceptez une offre, suivez l'artisan en direct et échangez via le chat.",
  },
  {
    step: "4",
    title: "Payez en sécurité",
    body: "Le paiement est libéré une fois la mission terminée à votre satisfaction.",
  },
];

export default function CommentCaMarchePage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-navy">Comment ça marche</h1>
      <p className="mt-4 text-muted-foreground">
        DEPANNI.ma connecte citoyens et artisans certifiés pour des interventions à domicile au
        Maroc.
      </p>
      <ol className="mt-12 space-y-8">
        {steps.map((item) => (
          <li key={item.step} className="flex gap-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {item.step}
            </span>
            <div>
              <h2 className="text-xl font-semibold text-navy">{item.title}</h2>
              <p className="mt-2 text-muted-foreground">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
