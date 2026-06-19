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

// Simple in-memory rate limiter for login attempts.
// In a multi-instance deployment use Redis or similar.
type LimitEntry = { count: number; resetAt: number };
const loginAttempts = new Map<string, LimitEntry>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOGIN_MAX_ATTEMPTS = 5;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= LOGIN_MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

// Patterns commonly used in reflected XSS / command-injection probes.
// These are checked against raw query parameter values before Next.js renders them.
const SUSPICIOUS_QUERY_PATTERNS = [
  /<script\b/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<\s*iframe/i,
  /<\s*object/i,
  /<\s*embed/i,
  /;\s*echo\s+/i,
  /\|\s*echo\s+/i,
  /&&\s*echo\s+/i,
  /\|\|\s*echo\s+/i,
  /\$\(\s*echo\s+/i,
  /`\s*echo\s+/i,
];

function hasSuspiciousQueryParams(url: URL): boolean {
  for (const value of url.searchParams.values()) {
    for (const pattern of SUSPICIOUS_QUERY_PATTERNS) {
      if (pattern.test(value)) {
        return true;
      }
    }
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block common injection probes in query parameters before they are reflected.
  if (request.method === "GET" && hasSuspiciousQueryParams(request.nextUrl)) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // Rate-limit login endpoint to mitigate brute-force and credential-stuffing.
  if (pathname === "/api/auth/login" || pathname === "/api/auth/login/") {
    if (request.method !== "POST") {
      return new NextResponse("Method Not Allowed", { status: 405 });
    }
    const ip = getClientIp(request);
    const { allowed, retryAfter } = checkLoginRateLimit(ip);
    if (!allowed) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      });
    }
  }

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

  const response = NextResponse.next();

  // Hardening headers for routes not already covered by the reverse proxy.
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/auth/login", "/:path*"],
};
