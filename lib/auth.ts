import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { createHash } from "crypto";
import { getAdminConfig } from "./db";

const COOKIE_NAME = "rsp96_admin_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-change-me-in-production"
);

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function verifyPassword(password: string): Promise<boolean> {
  const config = await getAdminConfig();
  if (!config) return false;
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  const expectedHash = envHash || config.passwordHash;
  return hashPassword(password) === expectedHash;
}

export async function createSession(): Promise<void> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<{ role: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { role: string };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
}
