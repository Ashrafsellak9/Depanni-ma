export interface ServiceCategoryItem {
  id: string;
  slug: string;
  nameFr: string;
  icon: string;
}

export interface SubcategoryItem {
  id: string;
  label: string;
}

/** Aligné seed API + web */
export const SERVICE_CATEGORIES: ServiceCategoryItem[] = [
  { id: "00000000-0000-4000-8000-000000000001", slug: "plomberie", nameFr: "Plomberie", icon: "🚿" },
  { id: "00000000-0000-4000-8000-000000000002", slug: "electricite", nameFr: "Électricité", icon: "⚡" },
  { id: "00000000-0000-4000-8000-000000000003", slug: "climatisation", nameFr: "Climatisation", icon: "❄️" },
  { id: "00000000-0000-4000-8000-000000000004", slug: "serrurerie", nameFr: "Serrurerie", icon: "🔐" },
  { id: "00000000-0000-4000-8000-000000000005", slug: "peinture", nameFr: "Peinture", icon: "🎨" },
  { id: "00000000-0000-4000-8000-000000000006", slug: "mecanique", nameFr: "Mécanique", icon: "🔧" },
];

export const SUBCATEGORIES_BY_SLUG: Record<string, SubcategoryItem[]> = {
  plomberie: [
    { id: "fuite", label: "Fuite d'eau" },
    { id: "debouchage", label: "Débouchage" },
    { id: "chauffe-eau", label: "Chauffe-eau" },
    { id: "robinetterie", label: "Robinetterie" },
    { id: "installation", label: "Installation sanitaire" },
  ],
  electricite: [
    { id: "panne", label: "Panne électrique" },
    { id: "tableau", label: "Tableau électrique" },
    { id: "prises", label: "Prises / interrupteurs" },
    { id: "eclairage", label: "Éclairage" },
    { id: "mise-aux-normes", label: "Mise aux normes" },
  ],
  climatisation: [
    { id: "installation-clim", label: "Installation clim" },
    { id: "recharge", label: "Recharge gaz" },
    { id: "entretien", label: "Entretien" },
    { id: "panne-clim", label: "Panne climatisation" },
  ],
  serrurerie: [
    { id: "ouverture", label: "Ouverture de porte" },
    { id: "changement-serrure", label: "Changement de serrure" },
    { id: "blindage", label: "Blindage" },
    { id: "cle", label: "Reproduction de clé" },
  ],
  peinture: [
    { id: "interieur", label: "Peinture intérieure" },
    { id: "exterieur", label: "Peinture extérieure" },
    { id: "finition", label: "Finitions / enduit" },
  ],
  mecanique: [
    { id: "diagnostic", label: "Diagnostic" },
    { id: "vidange", label: "Vidange" },
    { id: "freins", label: "Freins" },
    { id: "batterie", label: "Batterie" },
    { id: "depannage", label: "Dépannage sur place" },
  ],
};
