"use client";

import React, { createContext, useContext } from "react";
import { DEFAULT_SETTINGS } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SiteSettingsProvider({ settings, children }: { settings: SiteSettings; children: React.ReactNode }) {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
