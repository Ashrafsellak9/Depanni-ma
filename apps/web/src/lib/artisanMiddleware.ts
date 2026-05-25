import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ARTISAN_PUBLIC = ["/artisan/login", "/artisan/register", "/artisan/pending"];

const LEGACY_ARTISAN_REDIRECTS: Record<string, string> = {
  "/artisan/dashboard": "/artisan",
  "/artisan/earnings": "/artisan/revenus",
  "/artisan/profile": "/artisan/profil",
};

function isArtisanPath(pathname: string): boolean {
  return pathname === "/artisan" || pathname.startsWith("/artisan/");
}

function isArtisanPublic(pathname: string): boolean {
  return ARTISAN_PUBLIC.some((p) => pathname === p);
}

function isArtisanProtected(pathname: string): boolean {
  return isArtisanPath(pathname) && !isArtisanPublic(pathname);
}

/** Cookie-based artisan gate — returns a Response or null to continue other middleware */
export function handleArtisanAuth(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (!isArtisanPath(pathname)) {
    return null;
  }

  const legacy = LEGACY_ARTISAN_REDIRECTS[pathname];
  if (legacy) {
    return NextResponse.redirect(new URL(legacy, request.url));
  }

  const token = request.cookies.get("artisan_token")?.value;
  const status = request.cookies.get("artisan_status")?.value;

  if (isArtisanPublic(pathname)) {
    if (token && status === "approved" && (pathname === "/artisan/login" || pathname === "/artisan/register")) {
      return NextResponse.redirect(new URL("/artisan", request.url));
    }
    if (token && status === "pending" && pathname === "/artisan/login") {
      return NextResponse.redirect(new URL("/artisan/pending", request.url));
    }
    return NextResponse.next();
  }

  if (isArtisanProtected(pathname)) {
    if (!token) {
      const login = new URL("/artisan/login", request.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
    if (status === "pending" && pathname !== "/artisan/pending") {
      return NextResponse.redirect(new URL("/artisan/pending", request.url));
    }
  }

  return NextResponse.next();
}
