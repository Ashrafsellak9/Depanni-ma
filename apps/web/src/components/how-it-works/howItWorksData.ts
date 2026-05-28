import {
  Clock,
  MapPin,
  Shield,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type StepColor = "orange" | "navy";
export type Audience = "client" | "artisan";

export interface HowItWorksStep {
  num: string;
  title: string;
  desc: string;
  time: string;
  timeIcon: LucideIcon;
  details: string[];
  color: StepColor;
  visual: string;
}

export const HEADER_STATS = [
  { value: "< 2 min", label: "Pour créer une demande" },
  { value: "< 8 min", label: "Première offre reçue" },
  { value: "4.8/5", label: "Satisfaction client" },
  { value: "100%", label: "Artisans vérifiés" },
] as const;

export const CLIENT_STEPS: HowItWorksStep[] = [
  {
    num: "01",
    title: "Décrivez votre besoin",
    desc: "Sélectionnez la catégorie, décrivez le problème en texte ou à l'oral, ajoutez des photos. Notre IA détecte automatiquement le type d'intervention.",
    time: "< 2 minutes",
    timeIcon: Clock,
    details: [
      "Texte, photos ou message vocal",
      "Catégories : plomberie, électricité, serrurerie...",
      "Niveau d'urgence : immédiat / planifié",
    ],
    visual: "step1_phone",
    color: "orange",
  },
  {
    num: "02",
    title: "Recevez des propositions",
    desc: "Les artisans disponibles près de vous reçoivent une alerte et proposent leur prix. Vous comparez les profils, notes et tarifs en un coup d'œil.",
    time: "< 8 minutes",
    timeIcon: Zap,
    details: [
      "Prix proposé par l'artisan avant déplacement",
      "Note, avis clients et distance visible",
      "Jusqu'à 10 propositions simultanées",
    ],
    visual: "step2_offers",
    color: "navy",
  },
  {
    num: "03",
    title: "Choisissez & suivez en direct",
    desc: "Acceptez l'offre qui vous convient. Suivez l'artisan en temps réel sur la carte et communiquez via le chat intégré.",
    time: "Temps réel",
    timeIcon: MapPin,
    details: [
      "Tracking GPS de l'artisan sur la carte",
      "Chat + appel direct in-app",
      "Notification à l'arrivée (500 m)",
    ],
    visual: "step3_tracking",
    color: "orange",
  },
  {
    num: "04",
    title: "Payez & notez en toute sécurité",
    desc: "Le paiement est sécurisé et libéré uniquement après votre validation. Notez l'artisan pour aider la communauté.",
    time: "Immédiat",
    timeIcon: Shield,
    details: [
      "CB, Orange Money, Inwi Money ou cash",
      "Paiement libéré après validation client",
      "Reçu numérique envoyé automatiquement",
    ],
    visual: "step4_payment",
    color: "navy",
  },
];

export const ARTISAN_STEPS: HowItWorksStep[] = [
  {
    num: "01",
    title: "Créez votre profil",
    desc: "Inscrivez-vous en 5 minutes. Notre équipe vérifie votre identité et vos documents dans les 48 h.",
    time: "5 minutes",
    timeIcon: Clock,
    details: [
      "CIN + photo de profil",
      "Spécialités et zone d'intervention",
      "Badge Vérifié DEPANNI après validation",
    ],
    visual: "artisan_step1",
    color: "orange",
  },
  {
    num: "02",
    title: "Recevez des alertes missions",
    desc: "Activez votre disponibilité et recevez des notifications push pour chaque demande près de chez vous.",
    time: "Temps réel",
    timeIcon: Zap,
    details: [
      "Alertes géolocalisées dans votre rayon",
      "10 secondes pour décider d'accepter",
      "Détails client + photos du problème",
    ],
    visual: "artisan_step2",
    color: "navy",
  },
  {
    num: "03",
    title: "Proposez votre prix",
    desc: "Soumettez votre offre en quelques secondes. Le client compare et choisit. Vous n'êtes jamais obligé d'accepter.",
    time: "< 30 secondes",
    timeIcon: Clock,
    details: [
      "Vous fixez votre propre tarif",
      "Délai d'arrivée estimé",
      "Message optionnel au client",
    ],
    visual: "artisan_step3",
    color: "orange",
  },
  {
    num: "04",
    title: "Réalisez & encaissez",
    desc: "Effectuez la mission, le paiement est sécurisé et viré sur votre compte dans les 24 heures.",
    time: "Virement 24 h",
    timeIcon: Shield,
    details: [
      "Commission 7–15 % selon votre abonnement",
      "Virement CIH, Attijariwafa, Orange Money",
      "Historique et reçus disponibles",
    ],
    visual: "artisan_step4",
    color: "navy",
  },
];

export const FAQ_ITEMS = [
  {
    q: "Combien de temps faut-il pour trouver un artisan ?",
    a: "En moyenne moins de 8 minutes. Pour les urgences, des artisans disponibles immédiatement sont prioritairement alertés dans votre secteur.",
  },
  {
    q: "Comment sont vérifiés les artisans ?",
    a: "Chaque artisan soumet une CIN, une photo de profil et idéalement une attestation de compétence. Notre équipe valide manuellement chaque dossier avant activation du compte.",
  },
  {
    q: "Que se passe-t-il si je ne suis pas satisfait ?",
    a: "Vous validez le paiement uniquement si vous êtes satisfait. En cas de litige, notre équipe intervient sous 72 h pour trouver une solution.",
  },
  {
    q: "Quels modes de paiement sont acceptés ?",
    a: "Carte bancaire (Visa/Mastercard), Orange Money, Inwi Money, et paiement en espèces confirmé dans l'application.",
  },
  {
    q: "Est-ce disponible partout au Maroc ?",
    a: "Pour l'instant, DEPANNI.ma est lancé à El Jadida. Nous prévoyons Casablanca et Rabat dans les prochains mois.",
  },
  {
    q: "Les artisans fixent-ils leurs propres prix ?",
    a: "Oui. Chaque artisan propose son propre tarif pour chaque mission. Vous comparez et choisissez librement.",
  },
] as const;
