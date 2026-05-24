import {
  Droplets,
  Wrench,
  Zap,
  Wind,
  KeyRound,
  Paintbrush,
  type LucideIcon,
} from "lucide-react";

export interface ServiceCategoryItem {
  id: string;
  slug: string;
  nameFr: string;
  icon: LucideIcon;
}

/** Aligné sur le seed API — remplacer par GET /categories quand disponible */
export const SERVICE_CATEGORIES: ServiceCategoryItem[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    slug: "plomberie",
    nameFr: "Plomberie",
    icon: Droplets,
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    slug: "electricite",
    nameFr: "Électricité",
    icon: Zap,
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    slug: "climatisation",
    nameFr: "Climatisation",
    icon: Wind,
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    slug: "serrurerie",
    nameFr: "Serrurerie",
    icon: KeyRound,
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    slug: "peinture",
    nameFr: "Peinture",
    icon: Paintbrush,
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    slug: "mecanique",
    nameFr: "Mécanique",
    icon: Wrench,
  },
];
