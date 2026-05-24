import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { AUTH_ROUTES, getDashboardForRole } from "@/lib/auth";
import type { UserRole } from "@/types";

const publicPaths = ["/", "/comment-ca-marche", "/login", "/register"];

const citizenPaths = ["/dashboard", "/missions", "/profile", "/request"];

const legacyCitizenRedirects: Record<string, string> = {
  "/citizen/dashboard": "/dashboard",
  "/citizen/missions": "/missions",
  "/citizen/profile": "/profile",
  "/citizen/request/new": "/request/new",
};

function isPublic(pathname: string): boolean {
  return publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function matchPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isCitizenArea(pathname: string): boolean {
  return citizenPaths.some((p) => matchPrefix(pathname, p));
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role as UserRole | undefined;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const legacy = legacyCitizenRedirects[pathname];
  if (legacy) {
    return NextResponse.redirect(new URL(legacy, req.url));
  }
  if (pathname.startsWith("/citizen/missions/")) {
    const id = pathname.replace("/citizen/missions/", "");
    return NextResponse.redirect(new URL(`/missions/${id}`, req.url));
  }

  if (isPublic(pathname)) {
    if (session && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL(getDashboardForRole(role ?? "CITIZEN"), req.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const login = new URL(AUTH_ROUTES.login, req.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  if (isCitizenArea(pathname) && role !== "CITIZEN" && role !== "ADMIN") {
    return NextResponse.redirect(new URL(getDashboardForRole(role ?? "ARTISAN"), req.url));
  }

  if (matchPrefix(pathname, "/citizen") && role !== "CITIZEN" && role !== "ADMIN") {
    return NextResponse.redirect(new URL(getDashboardForRole(role ?? "ARTISAN"), req.url));
  }

  if (matchPrefix(pathname, "/artisan") && role !== "ARTISAN" && role !== "ADMIN") {
    return NextResponse.redirect(new URL(getDashboardForRole(role ?? "CITIZEN"), req.url));
  }

  if (matchPrefix(pathname, "/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(getDashboardForRole(role ?? "CITIZEN"), req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3)$).*)"],
};
