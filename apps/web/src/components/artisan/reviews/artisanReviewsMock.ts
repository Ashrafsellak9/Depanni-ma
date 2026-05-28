export type ReviewCriteria = {
  quality: number;
  punctuality: number;
  communication: number;
  price: number;
  cleanliness: number;
};

export type ArtisanReview = {
  id: number;
  client: { name: string; initials: string; color: string };
  rating: number;
  comment: string;
  date: string;
  mission: string;
  criteria: ReviewCriteria;
  reply: string | null;
  missionPrice: number;
};

export const MOCK_REVIEWS: ArtisanReview[] = [
  {
    id: 1,
    client: { name: "Fatima Z.", initials: "FZ", color: "#1E3A5F" },
    rating: 5,
    comment:
      "Très professionnel, rapide et propre. Je recommande vivement ! Khalid a réparé la fuite en moins d'une heure.",
    date: "Aujourd'hui",
    mission: "Fuite robinet cuisine",
    criteria: { quality: 5, punctuality: 5, communication: 5, price: 5, cleanliness: 5 },
    reply: null,
    missionPrice: 150,
  },
  {
    id: 2,
    client: { name: "Youssef B.", initials: "YB", color: "#7C3AED" },
    rating: 5,
    comment: "Excellent travail sur mon chauffe-eau. Prix honnête.",
    date: "Hier",
    mission: "Chauffe-eau HS",
    criteria: { quality: 5, punctuality: 5, communication: 5, price: 5, cleanliness: 5 },
    reply: "Merci Youssef ! Ce fut un plaisir d'intervenir. N'hésitez pas à faire appel à moi.",
    missionPrice: 425,
  },
  {
    id: 3,
    client: { name: "Hassan A.", initials: "HA", color: "#059669" },
    rating: 4,
    comment: "Bon artisan, ponctuel. Travail soigné.",
    date: "Il y a 2j",
    mission: "Tableau électrique",
    criteria: { quality: 4, punctuality: 5, communication: 4, price: 4, cleanliness: 5 },
    reply: "Merci Hassan pour votre retour !",
    missionPrice: 180,
  },
  {
    id: 4,
    client: { name: "Nadia M.", initials: "NM", color: "#B45309" },
    rating: 3,
    comment:
      "Travail correct mais un peu de retard au démarrage. Le résultat final est satisfaisant.",
    date: "Il y a 5j",
    mission: "Canalisation bouchée",
    criteria: { quality: 4, punctuality: 2, communication: 3, price: 4, cleanliness: 3 },
    reply: null,
    missionPrice: 200,
  },
];

export const STAR_DISTRIBUTION = [
  { star: 5, count: 162, pct: 81 },
  { star: 4, count: 28, pct: 14 },
  { star: 3, count: 6, pct: 3 },
  { star: 2, count: 3, pct: 1.5 },
  { star: 1, count: 1, pct: 0.5 },
];

export const CRITERIA_BREAKDOWN = [
  { label: "Qualité du travail", score: 4.9, color: "#1B8A4E" },
  { label: "Ponctualité", score: 4.8, color: "#1B8A4E" },
  { label: "Communication", score: 4.9, color: "#1B8A4E" },
  { label: "Rapport qualité-prix", score: 4.7, color: "#F05A1A" },
  { label: "Propreté", score: 5.0, color: "#1B8A4E" },
];

export const RATING_TREND = [
  { month: "Jan", note: 4.6 },
  { month: "Fév", note: 4.7 },
  { month: "Mar", note: 4.7 },
  { month: "Avr", note: 4.8 },
  { month: "Mai", note: 4.9 },
];

export const TOTAL_REVIEWS = 200;
export const AVERAGE_RATING = 4.9;

export type ReviewFilterId = "all" | "5" | "4" | "low" | "unreplied";

export function filterReviews(reviews: ArtisanReview[], filter: ReviewFilterId) {
  if (filter === "all") return reviews;
  if (filter === "5") return reviews.filter((r) => r.rating === 5);
  if (filter === "4") return reviews.filter((r) => r.rating === 4);
  if (filter === "low") return reviews.filter((r) => r.rating <= 3);
  if (filter === "unreplied") return reviews.filter((r) => !r.reply);
  return reviews;
}

export function getFilterCounts(reviews: ArtisanReview[]) {
  return {
    all: TOTAL_REVIEWS,
    "5": STAR_DISTRIBUTION.find((r) => r.star === 5)?.count ?? 0,
    "4": STAR_DISTRIBUTION.find((r) => r.star === 4)?.count ?? 0,
    low:
      (STAR_DISTRIBUTION.find((r) => r.star === 3)?.count ?? 0) +
      (STAR_DISTRIBUTION.find((r) => r.star === 2)?.count ?? 0) +
      (STAR_DISTRIBUTION.find((r) => r.star === 1)?.count ?? 0),
    unreplied: reviews.filter((r) => !r.reply).length,
  };
}
