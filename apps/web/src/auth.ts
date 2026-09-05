import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { setAccessToken } from "@/lib/token";
import { getDashboardForRole } from "@/lib/auth";
import type { AuthSession, AuthUser, UserRole } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        phone: { label: "Téléphone", type: "tel" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const phone = credentials?.phone as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!password || (!email && !phone)) return null;

        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...(email ? { email } : {}),
            ...(phone ? { phone } : {}),
            password,
          }),
          credentials: "include",
        });

        if (!res.ok) return null;

        const json = (await res.json()) as { data: AuthSession };
        const session = json.data;
        if (!session?.accessToken || !session?.user) return null;

        setAccessToken(session.accessToken);

        return {
          id: session.user.id,
          email: session.user.email,
          name: `${session.user.firstName} ${session.user.lastName}`,
          role: session.user.role,
          accessToken: session.accessToken,
          user: session.user,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as {
          accessToken: string;
          role: UserRole;
          user: AuthUser;
        };
        token.accessToken = u.accessToken;
        token.role = u.role;
        token.profile = u.user;
        setAccessToken(u.accessToken);
      }
      return token;
    },
    async session({ session, token }) {
      if (token.profile) {
        session.user = {
          ...session.user,
          id: (token.profile as AuthUser).id,
          role: token.role as UserRole,
          profile: token.profile as AuthUser,
        };
      }
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signIn({ user }) {
      const role = (user as { role?: UserRole }).role;
      if (role) {
        // Token déjà posé dans authorize / jwt
      }
    },
  },
});

export function redirectAfterLogin(role: UserRole): string {
  return getDashboardForRole(role);
}
