"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Browser client for the signed-in staff member (used for direct uploads to Storage). */
export function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createBrowserClient(url, anonKey);
}
