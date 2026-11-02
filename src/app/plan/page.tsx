import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import PlannerChat from "@/components/planner/PlannerChat";
import { Sparkles, BadgeCheck, CloudSun, Ban } from "lucide-react";

export const metadata: Metadata = {
  title: "AI trip planner",
  description: "Plan your Sri Lanka trip in a conversation. Our AI planner suggests real tours and routes with prices, and our Colombo team confirms every detail.",
};

const POINTS = [
  { icon: BadgeCheck, text: "Only our real tours, hotels and prices" },
  { icon: CloudSun, text: "Season and monsoon advice for your dates" },
  { icon: Ban, text: "No payment until a specialist confirms" },
];

export default function PlanPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = typeof searchParams.q === "string" ? searchParams.q.slice(0, 400) : undefined;

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <div className="container-page grid flex-1 grid-cols-1 gap-8 pb-8 pt-[100px] lg:grid-cols-12 lg:pt-[112px]">
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-28">
            <p className="eyebrow">
              <Sparkles className="h-3.5 w-3.5 text-fly-orange" />
              AI trip planner
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-fly-navy-900">Plan your Sri Lanka trip in a conversation</h1>
            <p className="mt-4 text-slate-500">
              Tell the planner what you have in mind. It drafts a route from our tours and destinations, prices it, and you can send it to our team with one click.
            </p>
            <ul className="mt-8 space-y-4">
              {POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                    <Icon className="h-4 w-4 text-fly-orange" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="card flex h-[calc(100svh-132px)] min-h-[520px] flex-col overflow-hidden lg:col-span-8">
          <h1 className="sr-only lg:hidden">AI trip planner</h1>
          <PlannerChat initialPrompt={q} />
        </section>
      </div>
    </main>
  );
}
