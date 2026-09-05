export type FaqItem = {
  id: string;
  question: string;
  lead?: string;
  body: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "cout",
    question: "Combien coûte une intervention\u00a0?",
    lead: "Le devis est toujours gratuit.",
    body: "Les interventions démarrent à 150 MAD selon le service. Vous voyez le prix avant de valider, et vous ne payez que si vous acceptez.",
  },
  {
    id: "delai",
    question: "En combien de temps un artisan arrive-t-il\u00a0?",
    lead: "En moyenne 25 minutes à El Jadida pour les urgences (plomberie, serrurerie, électricité).",
    body: "Pour les interventions planifiées, vous choisissez votre créneau.",
  },
  {
    id: "kyc",
    question: "Les artisans sont-ils vérifiés\u00a0?",
    lead: "Oui.",
    body: "Chaque artisan passe une vérification KYC (pièce d'identité, patente, attestation), et son historique d'interventions est visible dans l'app. Nous refusons environ 40 % des candidatures.",
  },
  {
    id: "satisfait",
    question: "Que se passe-t-il si je ne suis pas satisfait\u00a0?",
    lead: "Vous pouvez signaler un problème dans les 48 h suivant l'intervention.",
    body: "Notre équipe médie, et nous garantissons une réintervention gratuite ou un remboursement selon les cas.",
  },
  {
    id: "paiement",
    question: "Comment se passe le paiement\u00a0?",
    lead: "Paiement sécurisé dans l'app par carte bancaire ou espèces après validation du travail.",
    body: "Aucun paiement d'avance, aucun frais caché.",
  },
  {
    id: "annuler",
    question: "Puis-je annuler ma demande\u00a0?",
    lead: "Oui, sans frais tant qu'aucun artisan n'a été assigné.",
    body: "Après assignation, une petite indemnité de déplacement peut s'appliquer (précisée avant confirmation).",
  },
  {
    id: "assurance",
    question: "Les artisans sont-ils assurés\u00a0?",
    lead: "Tous les artisans DEPANNI disposent d'une responsabilité civile professionnelle vérifiée.",
    body: "En cas de dommage causé pendant l'intervention, vous êtes couvert.",
  },
  {
    id: "quartiers",
    question: "Dans quels quartiers d'El Jadida intervenez-vous\u00a0?",
    lead: "Nous couvrons l'ensemble de l'agglomération : Centre-ville, Hay Salam, Hay El Matar, Sidi Bouzid, Plateau, El Jadida Beach, et les zones périphériques.",
    body: "Voir la carte de couverture ci-dessous.",
  },
];
