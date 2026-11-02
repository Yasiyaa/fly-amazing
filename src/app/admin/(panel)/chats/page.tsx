import Link from "next/link";
import { getSessionClient } from "@/lib/supabase/session";
import { cn } from "@/lib/utils";

export default async function AdminChats({ searchParams }: { searchParams: { session?: string } }) {
  const db = getSessionClient()!;
  const { data: sessions } = await db
    .from("chat_sessions")
    .select("id, message_count, input_tokens, output_tokens, created_at, last_at")
    .order("last_at", { ascending: false })
    .limit(100);
  const selected = searchParams.session && /^[0-9a-f-]{36}$/.test(searchParams.session) ? searchParams.session : sessions?.[0]?.id;
  const { data: messages } = selected
    ? await db.from("chat_messages").select("id, role, content, created_at").eq("session_id", selected).order("id")
    : { data: [] };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fly-navy-900">AI planner chats</h1>
        <p className="mt-1 text-sm text-slate-500">Conversations from the website planner. Visitors are identified only by an anonymous hash.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="card max-h-[70vh] divide-y divide-slate-100 overflow-y-auto lg:col-span-4">
          {(sessions ?? []).length === 0 && <p className="p-5 text-sm text-slate-500">No conversations yet.</p>}
          {(sessions ?? []).map((s) => (
            <Link key={s.id} href={`/admin/chats?session=${s.id}`} className={cn("block p-4 text-sm hover:bg-slate-50", s.id === selected && "bg-fly-cyan-50/60")}>
              <p className="font-medium text-slate-900">{new Date(s.last_at).toLocaleString("en-GB", { timeZone: "Asia/Colombo" })}</p>
              <p className="text-xs text-slate-500">
                {s.message_count} messages · {(Number(s.input_tokens) + Number(s.output_tokens)).toLocaleString()} tokens
              </p>
            </Link>
          ))}
        </div>
        <div className="card space-y-4 p-5 lg:col-span-8">
          {(messages ?? []).map((m) => (
            <div key={m.id} className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm", m.role === "user" ? "ml-auto bg-fly-navy text-white" : "bg-slate-100 text-slate-700")}>
              <p className="whitespace-pre-wrap">{m.content?.text}</p>
              {m.content?.itinerary && (
                <p className="mt-2 border-t border-slate-200 pt-2 text-xs text-slate-500">
                  Drafted itinerary: {m.content.itinerary.title} · US${m.content.itinerary.estimate?.totalUSD?.toLocaleString("en-US")}
                </p>
              )}
            </div>
          ))}
          {(messages ?? []).length === 0 && <p className="text-sm text-slate-500">Select a conversation.</p>}
        </div>
      </div>
    </div>
  );
}
