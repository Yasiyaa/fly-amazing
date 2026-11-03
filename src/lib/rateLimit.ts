import "server-only";
import { createHmac } from "crypto";

// Small in-memory sliding-window limiter. Serverless instances don't share memory, so this is a
// first line of defence against bursts from one visitor, not a hard global quota (the AI planner
// also enforces a daily cap in the database).

const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    // Drop the oldest keys so memory stays bounded.
    for (const k of Array.from(hits.keys()).slice(0, 1000)) hits.delete(k);
  }
  return true;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/**
 * Keyed one-way hash so raw IP addresses are never stored. Uses IP_HASH_SALT, falling back to the
 * (secret) service-role key so the key is never a public constant.
 */
export function hashIp(ip: string): string {
  const key = process.env.IP_HASH_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || "local-dev-only";
  return createHmac("sha256", key).update(ip).digest("hex").slice(0, 32);
}

/**
 * Public POST endpoints only accept JSON from our own pages. Blocks cross-site form posts that
 * would launder requests through visitors' browsers (and their IPs) past the rate limits.
 */
export function isSameOriginJson(request: Request): boolean {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return false;
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients; still rate-limited
  try {
    return new URL(origin).host === new URL(request.url).host || origin === process.env.NEXT_PUBLIC_SITE_URL;
  } catch {
    return false;
  }
}
