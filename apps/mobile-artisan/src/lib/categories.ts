export function getCategoryIcon(slug: string): string {
  const icons: Record<string, string> = {
    plomberie: "🚿",
    electricite: "⚡",
    climatisation: "❄️",
    serrurerie: "🔐",
    peinture: "🎨",
    mecanique: "🔧",
  };
  return icons[slug] ?? "🔧";
}

export function getCategoryLabel(slug: string): string {
  const labels: Record<string, string> = {
    plomberie: "Plomberie",
    electricite: "Électricité",
    climatisation: "Climatisation",
    serrurerie: "Serrurerie",
    peinture: "Peinture",
    mecanique: "Mécanique",
  };
  return labels[slug] ?? slug;
}
