// Simple in-memory rate limiter for login attempts.
// In a multi-instance deployment use Redis or similar.

export type LimitEntry = { count: number; resetAt: number };

const loginAttempts = new Map<string, LimitEntry>();

export const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const LOGIN_MAX_ATTEMPTS = 5;

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

export function checkLoginRateLimit(ip: string): RateLimitResult {
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
