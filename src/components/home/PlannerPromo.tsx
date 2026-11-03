import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, MessageCircle, Route, BadgeCheck } from "lucide-react";

const STEPS = [
  { icon: MessageCircle, title: "Tell it what you like", body: "Dates, who's travelling, budget, and whether you'd rather see leopards or lie on a beach." },
  { icon: Route, title: "Get a real itinerary", body: "Built only from our tours, hotels and drive times, with a price in your currency and monsoon advice." },
  { icon: BadgeCheck, title: "A person checks it", body: "Send it as a booking request and a Colombo specialist confirms every detail before you pay." },
];

export default function PlannerPromo() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">
              <Sparkles className="h-3.5 w-3.5 text-fly-orange" />
              AI trip planner
            </p>
            <h2 className="heading-section mt-3">Plan your trip in a conversation</h2>
            <p className="lede mt-4">
              Generic AI tools invent hotels and get the seasons wrong. Ours only uses our own tours, hotels and real drive times, and hands over to a person whenever you want.
            </p>
            <ul className="mt-8 space-y-5">
              {STEPS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fly-orange-50">
                    <Icon className="h-5 w-5 text-fly-orange" />
                  </span>
                  <span>
                    <span className="block font-semibold text-fly-navy-900">{title}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-slate-500">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/plan" className="btn-primary btn-lg mt-10">
              Start planning
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="panel relative overflow-hidden p-6 sm:p-8" aria-hidden="true">
            <div className="space-y-4 text-sm">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-fly-navy px-4 py-3 text-white">
                We have 10 days in February. My partner loves wildlife, I want tea country and a few beach days.
              </div>
              <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-slate-700 shadow-sm">
                February is ideal: dry in the hills and calm on the south coast. Here&rsquo;s a route that fits:
                <ol className="mt-3 space-y-1.5 text-slate-600">
                  <li>
                    <span className="font-semibold text-fly-navy-900">Days 1–3</span> Sigiriya &amp; Minneriya elephants
                  </li>
                  <li>
                    <span className="font-semibold text-fly-navy-900">Days 4–6</span> Kandy, tea estates, train to Ella
                  </li>
                  <li>
                    <span className="font-semibold text-fly-navy-900">Days 7–8</span> Yala leopard safaris
                  </li>
                  <li>
                    <span className="font-semibold text-fly-navy-900">Days 9–10</span> Mirissa beach &amp; whales
                  </li>
                </ol>
                <p className="mt-3 text-slate-500">Closest match: Grand Tour (shortened). Want me to price it with 4★ hotels?</p>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fly-cyan/15 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
