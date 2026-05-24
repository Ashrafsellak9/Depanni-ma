import type { UserRole } from "@/types";

export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
  citizenDashboard: "/dashboard",
  artisanDashboard: "/artisan/dashboard",
  adminDashboard: "/admin/dashboard",
} as const;

export function getDashboardForRole(role: UserRole): string {
  switch (role) {
    case "ARTISAN":
      return AUTH_ROUTES.artisanDashboard;
    case "ADMIN":
      return AUTH_ROUTES.adminDashboard;
    default:
      return AUTH_ROUTES.citizenDashboard;
  }
}

export function roleGuardPath(role: UserRole): string {
  switch (role) {
    case "ARTISAN":
      return "/artisan";
    case "ADMIN":
      return "/admin";
    default:
      return "";
  }
}
