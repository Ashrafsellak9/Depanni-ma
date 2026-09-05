// TODO: Brancher ce feed sur un vrai stream d'activité (websocket / polling 30s)
// avant production. Les événements ci-dessous sont des exemples représentatifs,
// pas un flux live. Ne pas les présenter comme des transactions temps réel.

export type LiveFeedIcon = "plus" | "user-plus" | "zap" | "users" | "trending-up";

export type LiveFeedRightElement =
  | "stars-5"
  | "badge-urgent"
  | "badge-new"
  | "badge-fast"
  | "badge-hot"
  | "live-dot";

export type LiveFeedAvatar = {
  initial: string;
  color: "sand" | "avatar-1" | "avatar-2" | "avatar-3" | "avatar-4" | "avatar-5";
};

export type LiveFeedEvent = {
  id: string;
  type: string;
  title: string;
  meta: string;
  avatar?: LiveFeedAvatar;
  icon?: LiveFeedIcon;
  rightElement?: LiveFeedRightElement;
};

export const LIVE_FEED_EVENTS: LiveFeedEvent[] = [
  {
    id: "1",
    type: "completion",
    avatar: { initial: "K", color: "sand" },
    title: "Karim K. vient de terminer une intervention",
    meta: "Plomberie · Hay Salam · Il y a 2 min",
    rightElement: "stars-5",
  },
  {
    id: "2",
    type: "new-request",
    icon: "plus",
    title: "Nouvelle demande de dépannage",
    meta: "Serrurerie · Centre-ville · Il y a 45 sec",
    rightElement: "badge-urgent",
  },
  {
    id: "3",
    type: "accept",
    avatar: { initial: "Y", color: "avatar-3" },
    title: "Youssef A. a accepté une mission",
    meta: "Électricité · Plateau · Il y a 3 min",
  },
  {
    id: "4",
    type: "rating",
    avatar: { initial: "H", color: "avatar-2" },
    title: "Hassan M. a reçu une note 5 étoiles",
    meta: "Ménage · Hay El Matar · Il y a 5 min",
    rightElement: "stars-5",
  },
  {
    id: "5",
    type: "join",
    icon: "user-plus",
    title: "Un nouvel artisan rejoint DEPANNI",
    meta: "Mécanique auto · Boulevard V · Il y a 8 min",
    rightElement: "badge-new",
  },
  {
    id: "6",
    type: "fast-response",
    icon: "zap",
    title: "Intervention en 9 minutes seulement",
    meta: "Serrurerie · Boulevard Mohammed V · Il y a 12 min",
    rightElement: "badge-fast",
  },
  {
    id: "7",
    type: "live-count",
    icon: "users",
    title: "24 artisans en ligne près de vous",
    meta: "Mis à jour maintenant",
    rightElement: "live-dot",
  },
  {
    id: "8",
    type: "completion",
    avatar: { initial: "F", color: "avatar-1" },
    title: "Fatima E. a terminé un ménage complet",
    meta: "Ménage · Sidi Bouzid · Il y a 15 min",
    rightElement: "stars-5",
  },
  {
    id: "9",
    type: "accept",
    avatar: { initial: "A", color: "avatar-5" },
    title: "Abdellah R. démarre une intervention",
    meta: "Peinture · El Jadida Beach · Il y a 18 min",
  },
  {
    id: "10",
    type: "volume",
    icon: "trending-up",
    title: "3 nouvelles demandes en 5 minutes",
    meta: "Toutes catégories · En cours d'attribution",
    rightElement: "badge-hot",
  },
];
