// ⚠️ PLACEHOLDERS À REMPLACER AVANT PRODUCTION
// Les photos actuelles sont issues d'Unsplash (libre de droits) mais
// ne représentent pas de vrais artisans DEPANNI. Avant mise en ligne :
// 1. Organiser un shooting photo avec les vrais artisans (loi 09-08 = consentement écrit obligatoire)
// 2. Vérifier que les noms/quartiers/notes/citations correspondent aux vrais artisans
// 3. Supprimer ce commentaire une fois les vraies photos intégrées
// TODO: Le lien "Voir tous les artisans" pointera vers /artisans (page à créer).

export type FeaturedArtisan = {
  id: string;
  firstName: string;
  lastInitial: string;
  trade: string;
  neighborhood: string;
  rating: number;
  interventions: number;
  yearsOnPlatform?: number;
  quote: string;
  photoUrl: string;
  isOnline?: boolean;
  /** CSS object-position when the source shot is wider than a chest-up crop. */
  photoPosition?: "object-center" | "object-top" | "object-bottom";
};

export const FEATURED_ARTISANS: FeaturedArtisan[] = [
  {
    id: "1",
    firstName: "Karim",
    lastInitial: "K.",
    trade: "Plombier",
    neighborhood: "Hay Salam",
    rating: 4.9,
    interventions: 127,
    yearsOnPlatform: 1,
    quote: "Sur DEPANNI depuis 8 mois, j'ai doublé mon activité et je gère mieux mon planning.",
    photoUrl: "/artisans/karim.jpg",
    isOnline: true,
  },
  {
    id: "2",
    firstName: "Youssef",
    lastInitial: "A.",
    trade: "Électricien",
    neighborhood: "Centre-ville",
    rating: 4.8,
    interventions: 203,
    quote: "Les paiements arrivent à temps, les clients sont sérieux. Ça change tout.",
    photoUrl: "/artisans/youssef.jpg",
    photoPosition: "object-bottom",
  },
  {
    id: "3",
    firstName: "Hassan",
    lastInitial: "M.",
    trade: "Serrurier",
    neighborhood: "Plateau",
    rating: 4.9,
    interventions: 89,
    quote: "Les urgences la nuit, c'est ma spécialité. DEPANNI me route direct.",
    photoUrl: "/artisans/hassan.jpg",
    isOnline: true,
  },
  {
    id: "4",
    firstName: "Sanae",
    lastInitial: "B.",
    trade: "Ménage & Nettoyage",
    neighborhood: "Hay El Matar",
    rating: 4.9,
    interventions: 156,
    quote: "Enfin une plateforme qui valorise notre métier avec du sérieux.",
    photoUrl: "/artisans/sanae.jpg",
    isOnline: true,
  },
  {
    id: "5",
    firstName: "Abdellah",
    lastInitial: "R.",
    trade: "Peintre",
    neighborhood: "El Jadida Beach",
    rating: 4.7,
    interventions: 64,
    quote: "Les chantiers rentrent tout seuls maintenant, je ne fais plus de démarchage.",
    photoUrl: "/artisans/abdellah.jpg",
  },
  {
    id: "6",
    firstName: "Rachid",
    lastInitial: "T.",
    trade: "Mécanicien",
    neighborhood: "Route de Casablanca",
    rating: 4.8,
    interventions: 112,
    quote: "Les dépannages en bord de route, c'est là que la géoloc fait la différence.",
    photoUrl: "/artisans/rachid.jpg",
    photoPosition: "object-top",
  },
  {
    id: "7",
    firstName: "Fatima",
    lastInitial: "E.",
    trade: "Ménage professionnel",
    neighborhood: "Sidi Bouzid",
    rating: 5.0,
    interventions: 98,
    quote: "Mes clientes régulières me réservent maintenant via l'app, plus de WhatsApp.",
    photoUrl: "/artisans/fatima.jpg",
  },
  {
    id: "8",
    firstName: "Mohamed",
    lastInitial: "L.",
    trade: "Électroménager",
    neighborhood: "Boulevard Mohammed V",
    rating: 4.8,
    interventions: 143,
    quote: "Machine à laver, four, frigo : les demandes arrivent tous les jours.",
    photoUrl: "/artisans/mohamed.jpg",
  },
];
