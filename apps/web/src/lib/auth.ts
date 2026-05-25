import type { UserRole } from "@/types";

export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
  /** Citoyen — publier une demande d'artisan */
  newRequest: "/request/new",
  citizenRegister: "/register/citizen",
  citizenDashboard: "/dashboard",
  artisanRegister: "/artisan/register",
  artisanLogin: "/artisan/login",
  artisanDashboard: "/artisan",
  adminDashboard: "/admin",
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
