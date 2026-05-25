/** Canonical admin routes (new dashboard shell). */
export const adminPaths = {
  home: "/admin",
  map: "/admin/map",
  missions: (id?: string) => (id ? `/admin/missions/${id}` : "/admin/missions"),
  artisans: (id?: string) => (id ? `/admin/artisans/${id}` : "/admin/artisans"),
  clients: "/admin/clients",
  kyc: "/admin/kyc",
  litiges: (id?: string) => (id ? `/admin/litiges/${id}` : "/admin/litiges"),
  finances: "/admin/finances",
  virements: "/admin/virements",
  analytics: "/admin/analytics",
  settings: "/admin/settings",
  notifications: "/admin/notifications",
} as const;
