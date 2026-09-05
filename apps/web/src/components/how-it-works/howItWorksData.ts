import {
  Clock,
  MapPin,
  Shield,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { PAYMENT_METHODS_LABEL } from "@/lib/siteConstants";

export type StepColor = "orange" | "navy";
export type Audience = "client" | "artisan";

export interface HowItWorksStep {
  num: string;
  title: string;
  desc: string;
  badge: string;
  badgeIcon: LucideIcon;
  badgeColor: StepColor;
  details: string[];
  color: StepColor;
  visual: string;
  visualAlt: string;
}

export const HEADER_STATS = [
  { value: "< 2", suffix: " min", label: "Pour créer une demande" },
  { value: "< 8", suffix: " min", label: "Première offre reçue" },
  { value: "4,8", suffix: "/5", label: "Satisfaction client" },
  { value: "100", suffix: " %", label: "Des artisans vérifiés" },
] as const;

export const CLIENT_STEPS: HowItWorksStep[] = [
  {
    num: "01",
    title: "Décrivez votre besoin",
    desc: "Sélectionnez la catégorie, décrivez le problème en texte ou à l'oral, ajoutez des photos. Notre IA détecte automatiquement le type d'intervention.",
    badge: "< 2 min",
    badgeIcon: Clock,
    badgeColor: "orange",
    details: [
      "Texte, photos ou message vocal",
      "Catégories : plomberie, électricité, serrurerie...",
      "Niveau d'urgence : immédiat ou planifié",
    ],
    visual: "step1_phone",
    visualAlt: "Aperçu mobile : sélection de la catégorie de dépannage sur DEPANNI.ma",
    color: "orange",
  },
  {
    num: "02",
    title: "Recevez des propositions",
    desc: "Les artisans disponibles près de vous reçoivent une alerte et proposent leur prix. Vous comparez les profils, notes et tarifs en un coup d'œil.",
    badge: "< 8 min",
    badgeIcon: Zap,
    badgeColor: "navy",
    details: [
      "Prix proposé par l'artisan avant déplacement",
      "Note, avis clients et distance visible",
      "Jusqu'à 3 offres pour comparer sereinement",
    ],
    visual: "step2_offers",
    visualAlt: "Aperçu mobile : comparaison des offres d'artisans vérifiés",
    color: "navy",
  },
  {
    num: "03",
    title: "Choisissez et suivez en direct",
    desc: "Acceptez l'offre qui vous convient. Suivez l'artisan en temps réel sur la carte et communiquez via le chat intégré.",
    badge: "Temps réel",
    badgeIcon: MapPin,
    badgeColor: "orange",
    details: [
      "Tracking GPS de l'artisan sur la carte",
      "Chat et appel direct in-app",
      "Notification à l'arrivée (500 m)",
    ],
    visual: "step3_tracking",
    visualAlt: "Aperçu mobile : suivi GPS de l'artisan en route",
    color: "orange",
  },
  {
    num: "04",
    title: "Payez et notez en toute sécurité",
    desc: "Le paiement est sécurisé et libéré uniquement après votre validation. Notez l'artisan pour aider la communauté.",
    badge: "Sécurisé",
    badgeIcon: Shield,
    badgeColor: "navy",
    details: [
      PAYMENT_METHODS_LABEL,
      "Paiement libéré après validation client",
      "Reçu numérique envoyé automatiquement",
    ],
    visual: "step4_payment",
    visualAlt: "Aperçu mobile : paiement sécurisé après validation de la mission",
    color: "navy",
  },
];

export const ARTISAN_STEPS: HowItWorksStep[] = [
  {
    num: "01",
    title: "Inscrivez-vous en 5 minutes",
    desc: "Créez votre compte, choisissez vos métiers et complétez votre vérification CIN pour obtenir le badge Artisan vérifié.",
    badge: "Gratuit",
    badgeIcon: Clock,
    badgeColor: "orange",
    details: [
      "Inscription gratuite en quelques minutes",
      "Choix de vos métiers et zone d'intervention",
      "Vérification CIN pour le badge Artisan vérifié",
    ],
    visual: "artisan_step1",
    visualAlt: "Aperçu mobile : inscription artisan et vérification d'identité",
    color: "orange",
  },
  {
    num: "02",
    title: "Recevez des alertes qualifiées",
    desc: "Les demandes géolocalisées dans votre rayon arrivent en temps réel avec le détail du problème et les photos du client.",
    badge: "Temps réel",
    badgeIcon: Zap,
    badgeColor: "navy",
    details: [
      "Alertes dans votre rayon d'intervention",
      "Détail du problème et photos jointes",
      "Vous décidez d'accepter ou de passer",
    ],
    visual: "artisan_step2",
    visualAlt: "Aperçu mobile : alerte de mission qualifiée à proximité",
    color: "navy",
  },
  {
    num: "03",
    title: "Proposez votre prix",
    desc: "Fixez librement votre tarif et votre délai d'arrivée. Le client compare les offres et choisit l'artisan qui lui convient.",
    badge: "Vous décidez",
    badgeIcon: Clock,
    badgeColor: "orange",
    details: [
      "Tarif fixé librement par vous",
      "Le client compare et choisit",
      "Message optionnel pour rassurer le client",
    ],
    visual: "artisan_step3",
    visualAlt: "Aperçu mobile : proposition de prix pour une mission",
    color: "orange",
  },
  {
    num: "04",
    title: "Intervenez et encaissez",
    desc: "Réalisez la mission, le paiement est bloqué puis libéré après validation client. Versements sur votre compte chaque semaine.",
    badge: "Sécurisé",
    badgeIcon: Shield,
    badgeColor: "navy",
    details: [
      "Paiement bloqué puis libéré après validation",
      "Versements chaque semaine sur votre compte",
      "Historique et reçus disponibles dans l'app",
    ],
    visual: "artisan_step4",
    visualAlt: "Aperçu mobile : revenus et versements hebdomadaires artisan",
    color: "navy",
  },
];

export const FAQ_ITEMS = [
  {
    q: "Combien de temps faut-il pour trouver un artisan ?",
    a: "En moyenne moins de 8 minutes. Pour les urgences, des artisans disponibles immédiatement sont prioritairement alertés dans votre secteur à El Jadida.",
  },
  {
    q: "Combien ça coûte pour le client ?",
    a: "La mise en relation est gratuite. Vous payez uniquement l'intervention acceptée, au tarif proposé par l'artisan que vous choisissez.",
  },
  {
    q: "Comment est fixé le prix ?",
    a: "Chaque artisan propose son propre tarif pour chaque mission. Vous comparez les offres (prix, note, délai) et choisissez librement celle qui vous convient.",
  },
  {
    q: "Comment sont vérifiés les artisans ?",
    a: "Chaque artisan soumet une CIN et une photo de profil, idéalement une attestation de compétence. Notre équipe valide manuellement chaque dossier avant activation du badge Artisan vérifié.",
  },
  {
    q: "Que se passe-t-il si je ne suis pas satisfait ?",
    a: "Vous validez le paiement uniquement si vous êtes satisfait. En cas de litige, notre équipe intervient sous 72 h pour trouver une solution, y compris une réintervention.",
  },
  {
    q: "Que se passe-t-il si l'artisan annule ?",
    a: "Vous êtes immédiatement notifié et pouvez choisir une autre offre ou relancer une demande. Si un paiement avait été bloqué, il est intégralement remboursé.",
  },
  {
    q: "Quels modes de paiement sont acceptés ?",
    a: `${PAYMENT_METHODS_LABEL}. Le paiement est sécurisé et libéré uniquement après votre validation de la mission.`,
  },
  {
    q: "Est-ce disponible partout au Maroc ?",
    a: "Pour l'instant, DEPANNI.ma est lancé à El Jadida avec +1 200 clients et 280+ artisans vérifiés. D'autres villes arrivent prochainement.",
  },
] as const;
