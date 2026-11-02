import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when the public Supabase URL and anon key are set. Without them the site runs on bundled seed data. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/** True when server-side writes (bookings, enquiries, chat logs) can be stored. */
export const canWriteToDatabase = Boolean(url && serviceKey);

let publicClient: SupabaseClient | null = null;
let serviceClient: SupabaseClient | null = null;

/** Anonymous client for catalogue reads. Row-level security limits it to published rows. */
export function getPublicClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  publicClient ??= createClient(url!, anonKey!, { auth: { persistSession: false } });
  return publicClient;
}

/**
 * Service-role client for trusted server writes (booking and enquiry inserts, chat logging).
 * Bypasses row-level security, so it must only be used in route handlers with validated input.
 */
export function getServiceClient(): SupabaseClient | null {
  if (!canWriteToDatabase) return null;
  serviceClient ??= createClient(url!, serviceKey!, { auth: { persistSession: false } });
  return serviceClient;
}
