"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import TourFinalizeModal from "@/components/inquiry/TourFinalizeModal";
import { CURATED_PACKAGES } from "@/data/packages";
import { cn } from "@/lib/utils";

interface PackageEnquireButtonProps {
  packageId: string;
  label?: string;
  className?: string;
}

/** Client island that opens the enquiry modal for a curated package. */
export default function PackageEnquireButton({ packageId, label = "Enquire about this trip", className }: PackageEnquireButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pkg = CURATED_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) return null;

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={cn("btn-primary btn-lg", className)}>
        {label}
        <ArrowRight className="h-4 w-4" />
      </button>
      <TourFinalizeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        tourData={{
          type: "package",
          packageName: pkg.title,
          curatedPackage: pkg,
          totalDays: pkg.durationDays,
          totalNights: pkg.durationNights,
          totalEstimatedAUD: pkg.priceAUD,
        }}
      />
    </>
  );
}
