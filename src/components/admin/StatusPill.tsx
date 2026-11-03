import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  requested: "bg-amber-50 text-amber-800",
  confirmed: "bg-fly-cyan-50 text-fly-cyan-800",
  deposit_paid: "bg-emerald-50 text-emerald-700",
  paid: "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-50 text-red-700",
  new: "bg-amber-50 text-amber-800",
  replied: "bg-fly-cyan-50 text-fly-cyan-800",
  closed: "bg-slate-100 text-slate-700",
};

export function StatusPill({ status, label }: { status: string; label?: string }) {
  return <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", STYLES[status] ?? "bg-slate-100 text-slate-700")}>{label ?? status}</span>;
}
