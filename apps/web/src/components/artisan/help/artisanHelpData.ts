export type FaqItem = { q: string; a: string };
export type FaqCategory = { label: string; icon: string; items: FaqItem[] };

export const HELP_CATEGORIES = [
  { icon: "💰", label: "Paiements & Revenus", count: 12, id: "payment" },
  { icon: "📋", label: "Gestion des missions", count: 8, id: "missions" },
  { icon: "👤", label: "Profil & KYC", count: 6, id: "profile" },
  { icon: "⭐", label: "Avis & Réputation", count: 5, id: "reviews" },
  { icon: "📱", label: "Application mobile", count: 7, id: "app" },
  { icon: "💳", label: "Abonnements", count: 4, id: "subscription" },
  { icon: "🚨", label: "Litiges & Problèmes", count: 6, id: "disputes" },
  { icon: "🔒", label: "Sécurité & Compte", count: 5, id: "security" },
] as const;

export type HelpCategoryId = (typeof HELP_CATEGORIES)[number]["id"];

export const FAQ_DATA: Record<HelpCategoryId, FaqCategory> = {
  missions: {
    label: "Gestion des missions",
    icon: "📋",
    items: [
      {
        q: "Comment accepter une mission ?",
        a: "Consultez l'onglet Missions → En attente. Vous avez un timer pour proposer votre prix avant expiration. Cliquez \"Proposer mon prix\", entrez votre tarif et délai d'arrivée, puis envoyez.",
      },
      {
        q: "Que faire si je ne peux pas honorer une mission acceptée ?",
        a: "Annulez dès que possible depuis l'onglet Missions → En cours. Plus de 3 annulations par mois entraînent une pénalité de 50 MAD et une baisse de votre priorité dans les alertes.",
      },
      {
        q: "Comment signaler un problème avec un client ?",
        a: "Sur la fiche de la mission, cliquez \"Signaler un problème\". Notre équipe intervient sous 24h. Ne prenez jamais de décision unilatérale — contactez le support d'abord.",
      },
      {
        q: "Pourquoi je ne reçois pas d'alertes missions ?",
        a: "Vérifiez : (1) votre statut est \"Disponible\" en haut à droite, (2) les notifications push sont activées sur votre téléphone, (3) votre zone d'intervention couvre la zone de la demande.",
      },
    ],
  },
  payment: {
    label: "Paiements & Revenus",
    icon: "💰",
    items: [
      {
        q: "Quand suis-je payé ?",
        a: "Le paiement est crédité sur votre solde DEPANNI dès que le client valide la mission. Le virement vers votre banque est traité dans les 24h ouvrées. Les virements sont automatiques chaque jour à 9h.",
      },
      {
        q: "Comment fonctionne la commission ?",
        a: "La commission standard est de 15%. Avec l'abonnement Premium (150 MAD/mois) elle descend à 10%, et avec l'abonnement Pro (350 MAD/mois) à 7%. Vos 30 premiers jours sont à 0% de commission.",
      },
      {
        q: "Vers quels comptes puis-je virer mon solde ?",
        a: "CIH Bank, Attijariwafa Bank, Banque Populaire, BMCE, Orange Money, Inwi Money. Ajoutez votre RIB dans Revenus → Virer vers banque. Le virement minimum est de 50 MAD.",
      },
      {
        q: "Que se passe-t-il si le client ne paie pas ?",
        a: "DEPANNI sécurise le paiement client avant l'intervention pour les paiements en ligne. Pour les paiements cash, signalez l'impayé sous 24h via le bouton \"Signaler\" sur la mission.",
      },
    ],
  },
  profile: {
    label: "Profil & KYC",
    icon: "👤",
    items: [
      {
        q: 'Comment obtenir le badge "Vérifié DEPANNI" ?',
        a: "Soumettez votre CIN recto/verso et une photo de profil claire. Notre équipe valide sous 24-48h. L'ajout d'une attestation de compétence accélère la validation.",
      },
      {
        q: "Combien de temps prend la validation KYC ?",
        a: "En général 24 à 48h ouvrées. Si vous n'avez pas de retour après 72h, contactez le support en mentionnant votre numéro de téléphone.",
      },
      {
        q: "Comment améliorer mon score de profil ?",
        a: "Complétez votre bio, ajoutez des photos de réalisations (au moins 3), renseignez vos horaires précis, ajoutez un attestation et répondez à tous vos avis clients.",
      },
    ],
  },
  reviews: {
    label: "Avis & Réputation",
    icon: "⭐",
    items: [
      {
        q: "Comment répondre à un avis négatif ?",
        a: "Allez dans Mes avis, trouvez l'avis et cliquez \"Répondre\". Restez professionnel et factuel. Les clients voient votre réponse — une réponse calme et constructive renforce votre image.",
      },
      {
        q: "Puis-je faire supprimer un avis abusif ?",
        a: "Oui, signalez l'avis en cliquant \"Signaler\" sous la réponse. Notre équipe l'examine sous 48h. Les avis contenant insultes, fausses informations ou hors sujet sont supprimés.",
      },
    ],
  },
  subscription: {
    label: "Abonnements",
    icon: "💳",
    items: [
      {
        q: "Quelle est la différence entre les abonnements ?",
        a: "Standard (gratuit): 15% commission. Premium (150 MAD/mois): 10% commission + virement prioritaire 24h. Pro (350 MAD/mois): 7% commission + badge Pro + support dédié + apparition prioritaire.",
      },
      {
        q: "Comment annuler mon abonnement ?",
        a: "Mon profil → Abonnement → Annuler. L'annulation prend effet à la fin de la période en cours. Aucun remboursement pour la période entamée.",
      },
    ],
  },
  app: {
    label: "Application mobile",
    icon: "📱",
    items: [
      {
        q: "Comment télécharger l'application DEPANNI Artisan ?",
        a: "Disponible sur Google Play et App Store. Recherchez \"DEPANNI Artisan\" ou scannez le QR code depuis votre tableau de bord web.",
      },
      {
        q: "Les notifications ne fonctionnent pas",
        a: "Vérifiez les autorisations dans Réglages → Notifications → DEPANNI. Sur Android, désactivez l'optimisation batterie pour l'app. Redémarrez l'application après modification.",
      },
      {
        q: "Puis-je utiliser uniquement l'application mobile ?",
        a: "Oui, toutes les fonctions essentielles (missions, revenus, profil) sont disponibles sur mobile. Certaines options avancées (export revenus, graphiques détaillés) sont réservées au web.",
      },
    ],
  },
  disputes: {
    label: "Litiges & Problèmes",
    icon: "🚨",
    items: [
      {
        q: "Comment ouvrir un litige avec un client ?",
        a: "Depuis la mission terminée, cliquez \"Signaler un problème\" et décrivez la situation. Joignez des photos si possible. Notre médiation intervient sous 24-48h.",
      },
      {
        q: "Que faire en cas de non-paiement cash ?",
        a: "Signalez sous 24h via la fiche mission. Ne vous engagez pas dans un conflit direct. DEPANNI peut bloquer le client et vous indemniser si le dossier est validé.",
      },
      {
        q: "Comment contester une pénalité ?",
        a: "Envoyez un message au support avec le numéro de mission concerné. Les pénalités injustifiées sont annulées sous 72h après examen.",
      },
    ],
  },
  security: {
    label: "Sécurité & Compte",
    icon: "🔒",
    items: [
      {
        q: "Comment changer mon mot de passe ?",
        a: "Profil → Sécurité & Documents → Changer mon mot de passe. Vous recevrez un code SMS de confirmation.",
      },
      {
        q: "Mon compte a été compromis",
        a: "Contactez immédiatement le support par téléphone. Nous bloquons l'accès, réinitialisons votre mot de passe et vérifions les activités récentes.",
      },
      {
        q: "Comment supprimer mon compte ?",
        a: "Envoyez une demande à support@depanni.ma depuis votre email enregistré. La suppression est effective sous 7 jours après règlement des missions en cours.",
      },
    ],
  },
};

export const VIDEO_TUTORIALS = [
  { title: "Prendre en main l'application", duration: "3:24", views: "1.2K", thumb: "🔧" },
  { title: "Optimiser votre profil artisan", duration: "4:15", views: "890", thumb: "👤" },
  { title: "Gérer vos revenus et virements", duration: "2:48", views: "654", thumb: "💰" },
];

export const POPULAR_SEARCHES = [
  "Paiement",
  "Commission",
  "KYC",
  "Annulation",
  "Abonnement Premium",
];

export type SearchableFaqItem = FaqItem & {
  category: string;
  icon: string;
  categoryId: HelpCategoryId;
};

export function buildSearchIndex(): SearchableFaqItem[] {
  return (Object.entries(FAQ_DATA) as [HelpCategoryId, FaqCategory][]).flatMap(
    ([key, cat]) =>
      cat.items.map((item) => ({
        ...item,
        category: cat.label,
        icon: cat.icon,
        categoryId: key,
      })),
  );
}

export function searchFaq(query: string, limit = 5): SearchableFaqItem[] {
  const q = query.toLowerCase().trim();
  if (q.length <= 2) return [];
  return buildSearchIndex()
    .filter(
      (item) =>
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    )
    .slice(0, limit);
}
