"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Loader2, MapPin, Sparkles, RotateCcw, MessageCircle, Mail } from "lucide-react";
import { Price } from "@/components/currency/CurrencyProvider";
import { useSiteSettings } from "@/components/layout/SiteSettingsProvider";
import RequestTripModal from "@/components/architect/RequestTripModal";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { VehicleId } from "@/lib/pricing";

interface Itinerary {
  title: string;
  summary: string;
  adults: number;
  children: number;
  vehicle: VehicleId;
  startDate: string | null;
  stops: { destinationId: string; destinationName: string; nights: number; hotelId: string | null; hotelName: string | null; plan: string }[];
  estimate: { days: number; nights: number; totalUSD: number; perPersonUSD: number; depositUSD: number };
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  itinerary?: Itinerary;
  error?: boolean;
}

const TOOL_LABELS: Record<string, string> = {
  search_tours: "Looking through our tours…",
  get_tour: "Reading the itinerary…",
  list_destinations: "Checking destinations and hotels…",
  check_dates: "Checking dates and seasons…",
  price_tour: "Pricing it…",
  draft_itinerary: "Drafting your itinerary…",
};

const STARTERS = [
  "We have 10 days in February. What do you recommend?",
  "Best family trip for a week with kids aged 6 and 9?",
  "Where should I go in July for beaches?",
  "Plan a honeymoon with boutique hotels",
];

const SESSION_KEY = "awt-planner";

export default function PlannerChat({ initialPrompt, compact = false }: { initialPrompt?: string; compact?: boolean }) {
  const settings = useSiteSettings();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [requesting, setRequesting] = useState<Itinerary | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentInitial = useRef(false);
  const restored = useRef(false);
  const [ready, setReady] = useState(false);

  // Restore this tab's conversation once. A new ?q= prompt starts a fresh chat instead.
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved && !initialPrompt) {
        const parsed = JSON.parse(saved) as { messages: ChatMessage[]; sessionId?: string };
        setMessages(parsed.messages ?? []);
        setSessionId(parsed.sessionId);
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, [initialPrompt]);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ messages: messages.slice(-40), sessionId }));
    } catch {
      // ignore
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sessionId, status, ready]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || busy) return;
      setInput("");
      setBusy(true);
      setStatus("Thinking…");
      const history = [...messages.filter((m) => !m.error), { role: "user" as const, text: content }];
      setMessages([...history, { role: "assistant", text: "" }]);

      const update = (fn: (m: ChatMessage) => ChatMessage) =>
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = fn(next[next.length - 1]);
          return next;
        });

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            messages: history.filter((m) => m.text).map((m) => ({ role: m.role, content: m.text.slice(0, 6000) })),
          }),
        });
        if (!res.ok || !res.body) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.error || "The planner isn't available right now.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            const event = JSON.parse(line);
            if (event.type === "session") setSessionId(event.id);
            else if (event.type === "text") {
              setStatus("");
              update((m) => ({ ...m, text: m.text + event.delta }));
            } else if (event.type === "tool") setStatus(TOOL_LABELS[event.name] ?? "Working on it…");
            else if (event.type === "itinerary") update((m) => ({ ...m, itinerary: event.itinerary }));
            else if (event.type === "error") update((m) => ({ ...m, text: m.text || event.message, error: !m.text }));
          }
        }
      } catch (error) {
        update((m) => ({ ...m, text: error instanceof Error ? error.message : "Something went wrong.", error: true }));
      } finally {
        setBusy(false);
        setStatus("");
      }
    },
    [busy, messages, sessionId]
  );

  // A ?q= link pre-fills the box; the visitor chooses to send it.
  useEffect(() => {
    if (ready && initialPrompt && !sentInitial.current) {
      sentInitial.current = true;
      setInput(initialPrompt);
    }
  }, [ready, initialPrompt]);

  const reset = () => {
    setMessages([]);
    setSessionId(undefined);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  };

  const whatsapp = whatsappLink(settings.whatsapp, "Hello! I was using your trip planner and would like to talk to someone.");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scrollRef} data-lenis-prevent className={cn("min-h-0 flex-1 space-y-4 overflow-y-auto", compact ? "p-4" : "p-4 sm:p-6")}>
        {messages.length === 0 && (
          <div className="py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fly-orange-50">
              <Sparkles className="h-5 w-5 text-fly-orange" />
            </div>
            <p className="mt-4 font-display text-xl font-bold text-fly-navy-900">Where would you like to go?</p>
            <p className="mt-1 text-sm text-slate-500">
              Tell me your dates, who&rsquo;s travelling and what you enjoy. I&rsquo;ll suggest a route with real prices from our tours.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-left text-sm text-slate-600 transition-colors hover:border-fly-cyan hover:bg-fly-cyan-50/50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[90%] text-sm leading-relaxed",
                m.role === "user"
                  ? "rounded-2xl rounded-br-md bg-fly-navy px-4 py-3 text-white"
                  : m.error
                  ? "rounded-2xl rounded-bl-md border border-red-200 bg-red-50 px-4 py-3 text-red-700"
                  : "w-full space-y-3 text-slate-700"
              )}
            >
              {m.role === "user" ? m.text : <RichText text={m.text} />}
              {m.itinerary && <ItineraryCard itinerary={m.itinerary} onRequest={() => setRequesting(m.itinerary!)} />}
            </div>
          </div>
        ))}

        {busy && status && (
          <p className="flex items-center gap-2 text-xs text-slate-400" aria-live="polite">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {status}
          </p>
        )}
      </div>

      <div className={cn("border-t border-slate-100 bg-white", compact ? "p-3" : "p-3 sm:p-4")}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2"
        >
          <label className="sr-only" htmlFor={compact ? "planner-input-compact" : "planner-input"}>
            Message the trip planner
          </label>
          <textarea
            id={compact ? "planner-input-compact" : "planner-input"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            maxLength={2000}
            placeholder="Ask about tours, seasons, routes…"
            className="field-input max-h-32 min-h-[46px] flex-1 resize-none py-3"
          />
          <button type="submit" disabled={busy || !input.trim()} className="btn-primary h-[46px] w-[46px] shrink-0 px-0" aria-label="Send">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
          </button>
        </form>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>AI planner · a specialist confirms every booking. Please don&rsquo;t share personal details here.</span>
          <span className="flex items-center gap-3">
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-fly-navy hover:text-fly-cyan-700">
                <MessageCircle className="h-3 w-3" />
                WhatsApp
              </a>
            )}
            <Link href="/contact" className="inline-flex items-center gap-1 font-medium text-fly-navy hover:text-fly-cyan-700">
              <Mail className="h-3 w-3" />
              Contact
            </Link>
            {messages.length > 0 && (
              <button type="button" onClick={reset} className="inline-flex items-center gap-1 font-medium text-fly-navy hover:text-fly-cyan-700">
                <RotateCcw className="h-3 w-3" />
                New chat
              </button>
            )}
          </span>
        </div>
      </div>

      {requesting && (
        <RequestTripModal
          isOpen
          onClose={() => setRequesting(null)}
          kind="planner"
          title={requesting.title}
          stops={requesting.stops}
          adults={requesting.adults}
          childCount={requesting.children}
          vehicle={requesting.vehicle}
          totalUSD={requesting.estimate.totalUSD}
          defaultStartDate={requesting.startDate}
        />
      )}
    </div>
  );
}

function ItineraryCard({ itinerary, onRequest }: { itinerary: Itinerary; onRequest: () => void }) {
  const travellers = itinerary.adults + itinerary.children;
  return (
    <div className="overflow-hidden rounded-2xl border border-fly-cyan-200 bg-white shadow-sm">
      <div className="bg-fly-navy-900 px-4 py-3 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fly-cyan-200">Draft itinerary</p>
        <p className="mt-0.5 font-display text-base font-bold">{itinerary.title}</p>
        <p className="text-xs text-slate-300">
          {itinerary.estimate.days} days · {travellers} {travellers === 1 ? "traveller" : "travellers"}
          {itinerary.startDate && ` · from ${itinerary.startDate}`}
        </p>
      </div>
      <ol className="divide-y divide-slate-100 px-4">
        {itinerary.stops.map((s, i) => (
          <li key={`${s.destinationId}-${i}`} className="flex gap-3 py-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-fly-orange" />
            <div className="min-w-0">
              <p className="font-semibold text-slate-900">
                {s.destinationName} <span className="font-normal text-slate-400">· {s.nights} night{s.nights === 1 ? "" : "s"}</span>
              </p>
              {s.plan && <p className="text-xs text-slate-500">{s.plan}</p>}
              {s.hotelName && <p className="text-xs text-slate-400">{s.hotelName} or similar</p>}
            </div>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-4 py-3">
        <div>
          <p className="text-[11px] text-slate-500">Estimate per person</p>
          <p className="font-display text-lg font-bold text-fly-navy-900">
            <Price usd={itinerary.estimate.perPersonUSD} />
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/tour-architect?stops=${itinerary.stops.map((s) => `${s.destinationId}:${s.nights}`).join(",")}`}
            className="btn-secondary btn-sm"
          >
            Customize
          </Link>
          <button type="button" onClick={onRequest} className="btn-primary btn-sm">
            Request to book
          </button>
        </div>
      </div>
    </div>
  );
}

/** Minimal, safe formatter: paragraphs, bullet and numbered lists, **bold**, and links to our own pages only. */
function RichText({ text }: { text: string }) {
  if (!text) return null;
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(
      <Tag key={blocks.length} className={cn("space-y-1 pl-5", list.ordered ? "list-decimal" : "list-disc")}>
        {list.items.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </Tag>
    );
    list = null;
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const ordered = Boolean(numbered);
      if (!list || list.ordered !== ordered) {
        flush();
        list = { ordered, items: [] };
      }
      list.items.push((bullet ?? numbered)![1]);
    } else {
      flush();
      if (line) blocks.push(<p key={blocks.length}>{inline(line.replace(/^#+\s*/, ""))}</p>);
    }
  }
  flush();
  return <>{blocks}</>;
}

/** Only links to our own pages, e.g. /tours/grand-tour-of-sri-lanka. Rejects //host and /\host. */
const INTERNAL_PATH = /^\/(?:tours|book|destinations|tour-architect|contact|plan|booking)(?:\/[a-z0-9-]+)?(?:\?[\w=&%-]*)?$/;

function inline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|(?<![\w/])\/(?:tours|book|destinations|tour-architect|contact|plan|booking)(?:\/[a-z0-9-]+)?(?:\?[\w=&%-]*)?)/g);
  return parts.map((part, i) => {
    if (!part) return null;
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i} className="font-semibold text-slate-900">{bold[1]}</strong>;
    const md = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (md) {
      const href = md[2];
      return INTERNAL_PATH.test(href) ? (
        <Link key={i} href={href} className="font-semibold text-fly-cyan-700 underline underline-offset-2">
          {md[1]}
        </Link>
      ) : (
        <span key={i}>{md[1]}</span>
      );
    }
    if (INTERNAL_PATH.test(part)) {
      return (
        <Link key={i} href={part} className="font-semibold text-fly-cyan-700 underline underline-offset-2">
          {part}
        </Link>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
