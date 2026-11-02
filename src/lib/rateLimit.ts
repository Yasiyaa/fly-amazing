import "server-only";
import { createHash } from "crypto";

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

/** One-way hash so raw IP addresses are never stored. */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "awt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
