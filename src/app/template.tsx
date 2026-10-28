"use client";

import React from "react";
import FlightTransitionOverlay from "@/components/transition/FlightTransitionOverlay";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FlightTransitionOverlay />
      {children}
    </>
  );
}
