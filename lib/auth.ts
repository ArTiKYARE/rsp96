import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { createHash, randomUUID } from "crypto";
import {
  createDefaultSuperAdmin,
  getAdminConfig,
  getAdminUsers,
  saveAdminUsers,
} from "./db";
import type { AdminPermission, AdminUser } from "./models";

export { getAdminUsers } from "./db";

const COOKIE_NAME = "rsp96_admin_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-change-me-in-production"
);

export interface AdminSession {
  userId: string;
  username: string;
  role: AdminUser["role"];
  permissions: AdminPermission[];
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function getUserByUsername(username: string): Promise<AdminUser | null> {
  const users = await getAdminUsers();
  return users.find((u) => u.username === username) ?? null;
}

export async function getUserById(id: string): Promise<AdminUser | null> {
  const users = await getAdminUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<AdminUser | null> {
  const user = await getUserByUsername(username);
  if (!user) return null;
  return hashPassword(password) === user.passwordHash ? user : null;
}

export async function createSession(user: AdminUser): Promise<void> {
  const token = await new SignJWT({
    userId: user.id,
    username: user.username,
    role: user.role,
    permissions: user.permissions,
  } as Record<string, unknown>)
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

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export function hasPermission(session: AdminSession | null, permission: AdminPermission): boolean {
  if (!session) return false;
  if (session.role === "superadmin") return true;
  return session.permissions.includes(permission);
}

export async function requirePermission(permission: AdminPermission): Promise<AdminSession> {
  const session = await requireAuth();
  if (!hasPermission(session, permission)) {
    throw new Error("Forbidden");
  }
  return session;
}

export async function requireSuperAdmin(): Promise<AdminSession> {
  const session = await requireAuth();
  if (session.role !== "superadmin") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function ensureAdminConfig(): Promise<void> {
  let config = await getAdminConfig();
  if (!config || config.users.length === 0) {
    const envHash = process.env.ADMIN_PASSWORD_HASH;
    await createDefaultSuperAdmin(envHash ? undefined : "admin123");
    if (envHash) {
      config = await getAdminConfig();
      if (config) {
        config.users[0].passwordHash = envHash;
        await saveAdminUsers(config.users);
      }
    }
  }
}

export function generateUsername(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  let result = "user_";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  for (let i = 0; i < 3; i++) {
    result += digits[Math.floor(Math.random() * digits.length)];
  }
  return result;
}

export function generatePassword(length = 12): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "!@#$%^&*";
  const all = upper + lower + digits + special;
  let password = "";
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += special[Math.floor(Math.random() * special.length)];
  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

export async function createAdminUser(input: {
  username?: string;
  role: AdminUser["role"];
  permissions: AdminPermission[];
}): Promise<{ user: Omit<AdminUser, "passwordHash">; plainPassword: string }> {
  await requireSuperAdmin();

  const users = await getAdminUsers();
  let username = input.username?.trim();

  if (!username) {
    do {
      username = generateUsername();
    } while (users.some((u) => u.username === username));
  } else if (users.some((u) => u.username === username)) {
    throw new Error("Username already exists");
  }

  const plainPassword = generatePassword();
  const user: AdminUser = {
    id: randomUUID(),
    username,
    passwordHash: hashPassword(plainPassword),
    role: input.role,
    permissions: input.role === "superadmin" ? ["services", "vacancies", "gallery", "safescanget", "users"] : input.permissions,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await saveAdminUsers(users);

  const { passwordHash, ...userWithoutHash } = user;
  return { user: userWithoutHash, plainPassword };
}

export async function deleteAdminUser(id: string, currentUserId: string): Promise<void> {
  await requireSuperAdmin();

  const users = await getAdminUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) throw new Error("User not found");

  if (id === currentUserId) throw new Error("Cannot delete yourself");

  const superAdmins = users.filter((u) => u.role === "superadmin");
  if (users[index].role === "superadmin" && superAdmins.length <= 1) {
    throw new Error("Cannot delete the last superadmin");
  }

  users.splice(index, 1);
  await saveAdminUsers(users);
}
