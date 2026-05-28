import type { PendingMission } from "@/components/artisan/PendingMissionCard";

export const PENDING_MISSIONS: PendingMission[] = [
  {
    id: "M-1090",
    type: "🔧",
    service: "Plomberie",
    subtype: "Fuite d'eau",
    distance: "1.2 km",
    eta: "8 min",
    budget: "100–200 MAD",
    urgency: "urgent",
    client: { name: "Mohammed O.", rating: "Bon client", missions: 3 },
    description: "Fuite importante sous le lavabo cuisine depuis ce matin.",
    expiresIn: 87,
    initialExpiresIn: 120,
    photos: ["photo1", "photo2"],
    competingArtisans: ["YM", "AB", "SK"],
    competingCount: 3,
  },
  {
    id: "M-1089",
    type: "⚡",
    service: "Électricité",
    subtype: "Panne courant",
    distance: "2.1 km",
    eta: "15 min",
    budget: "150–250 MAD",
    urgency: "normal",
    client: { name: "Fatima Z.", rating: "Excellente cliente", missions: 8 },
    description: "Panne totale dans l'appartement depuis hier soir.",
    expiresIn: 234,
    initialExpiresIn: 300,
    photos: ["photo1"],
    competingArtisans: ["KA", "YM"],
    competingCount: 2,
  },
];

export type ActiveMission = {
  id: string;
  service: string;
  client: { name: string; phone: string; address: string };
  price: number;
  startTime: string;
  status: "en_route" | "arrived" | "working" | "done";
};

export type CompletedMission = {
  id: string;
  service: string;
  client: string;
  date: string;
  price: number;
  net: number;
  rating: number;
};

export const ACTIVE_MISSION: ActiveMission = {
  id: "M-1088",
  service: "Plomberie — Fuite robinet",
  client: {
    name: "Mohammed O.",
    phone: "0612345678",
    address: "Av. Mohammed V, Hay Hassani, El Jadida",
  },
  price: 150,
  startTime: "14:30",
  status: "en_route" as const,
};

export const COMPLETED_MISSIONS = [
  {
    id: "M-1087",
    service: "🔧 Fuite robinet",
    client: "Fatima Z.",
    date: "Aujourd'hui 14h30",
    price: 255,
    net: 216,
    rating: 5,
  },
  {
    id: "M-1086",
    service: "🔧 Chauffe-eau",
    client: "Youssef B.",
    date: "Hier 11h00",
    price: 425,
    net: 361,
    rating: 5,
  },
  {
    id: "M-1085",
    service: "⚡ Tableau élec.",
    client: "Hassan A.",
    date: "Hier 09h30",
    price: 180,
    net: 153,
    rating: 4,
  },
  {
    id: "M-1084",
    service: "🔧 Canalisation",
    client: "Nadia M.",
    date: "Il y a 2j",
    price: 320,
    net: 272,
    rating: 5,
  },
  {
    id: "M-1083",
    service: "🔑 Serrurerie",
    client: "Omar K.",
    date: "Il y a 3j",
    price: 200,
    net: 170,
    rating: 3,
  },
];
