import type { DefaultSession } from "next-auth";

import type { AuthUser, UserRole } from "@/types";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      profile: AuthUser;
    };
  }

  interface User {
    role: UserRole;
    accessToken: string;
    user: AuthUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: UserRole;
    profile?: AuthUser;
  }
}
