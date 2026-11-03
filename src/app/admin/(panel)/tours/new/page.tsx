import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewTourForm from "@/components/admin/NewTourForm";

export default function AdminNewTourPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/tours" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-fly-navy">
        <ArrowLeft className="h-4 w-4" />
        Tours
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-fly-navy-900">Add a new tour</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter the basic details below. Once created, you can edit day-by-day itineraries, highlights, and gallery images.
        </p>
      </div>
      <NewTourForm />
    </div>
  );
}
