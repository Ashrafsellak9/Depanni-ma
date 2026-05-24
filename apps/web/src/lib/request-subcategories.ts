export interface SubcategoryItem {
  id: string;
  label: string;
}

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
