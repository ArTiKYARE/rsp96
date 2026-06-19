import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { AdminSession } from "@/lib/auth";
import type { AdminPermission } from "@/lib/models";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-change-me-in-production"
);
const COOKIE_NAME = "rsp96_admin_session";

const routePermissions: Record<string, AdminPermission> = {
  "/admin/services": "services",
  "/admin/vacancies": "vacancies",
  "/admin/gallery": "gallery",
  "/admin/safescanget": "safescanget",
  "/admin/users": "users",
};

function getRequiredPermission(pathname: string): AdminPermission | null {
  for (const [prefix, permission] of Object.entries(routePermissions)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return permission;
    }
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login/" && pathname !== "/admin/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login/", request.url));
    }

    let session: AdminSession | null = null;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      session = payload as unknown as AdminSession;
    } catch {
      return NextResponse.redirect(new URL("/admin/login/", request.url));
    }

    const required = getRequiredPermission(pathname);
    if (required) {
      if (session.role !== "superadmin" && !session.permissions.includes(required)) {
        return NextResponse.redirect(new URL("/admin/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
