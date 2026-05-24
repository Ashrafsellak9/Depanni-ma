import type { UserRole } from "@depanni/types";

declare global {
  namespace Express {
    interface AuthUser {
      id: string;
      email: string;
      role: UserRole;
    }

    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
