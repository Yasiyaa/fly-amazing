import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { PLANNER_TOOLS, runPlannerTool, type DraftItinerary } from "@/lib/planner/tools";
import { buildSystemPrompt } from "@/lib/planner/prompt";
import { getServiceClient } from "@/lib/supabase/clients";
import { clientIp, hashIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-opus-5-5";
const MAX_TOOL_ROUNDS = 6;
const MAX_TOKENS = 8000;
const MAX_USER_MESSAGES_PER_SESSION = 40;
const MAX_USER_MESSAGES_PER_DAY = 80;

const bodySchema = z.object({
  sessionId: z.string().uuid().optional(),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(6000) }))
    .min(1)
    .max(2 * MAX_USER_MESSAGES_PER_SESSION),
});

type Event =
  | { type: "session"; id: string }
  | { type: "text"; delta: string }
  | { type: "tool"; name: string }
  | { type: "itinerary"; itinerary: DraftItinerary }
  | { type: "error"; message: string }
  | { type: "done" };

const TOOLS: Anthropic.Beta.BetaTool[] = PLANNER_TOOLS.map((t) => ({ ...t, eager_input_streaming: true }));

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "The trip planner isn't available right now. Please use the contact form or WhatsApp." }, { status: 503 });
  }

  const ip = clientIp(request);
  if (!rateLimit(`chat:${ip}`, 20, 10 * 60_000)) {
    return Response.json({ error: "You're sending messages quickly. Please wait a minute and try again." }, { status: 429 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request." }, { status: 400 });
  const history = parsed.data.messages;
  const last = history[history.length - 1];
  if (last.role !== "user" || last.content.length > 2000) {
    return Response.json({ error: "Please keep messages under 2,000 characters." }, { status: 400 });
  }
  const userTurns = history.filter((m) => m.role === "user").length;
  if (userTurns > MAX_USER_MESSAGES_PER_SESSION) {
    return Response.json({ error: "This conversation is getting long. Please start a new one or send us your plan via the contact form." }, { status: 429 });
  }

  // Daily cap per visitor (stored as a salted hash, never the raw IP).
  const db = getServiceClient();
  const ipHash = hashIp(ip);
  let sessionId = parsed.data.sessionId;
  if (db) {
    const since = new Date(Date.now() - 86_400_000).toISOString();
    const { data: recent } = await db.from("chat_sessions").select("message_count").eq("ip_hash", ipHash).gte("last_at", since);
    const today = (recent ?? []).reduce((n, r) => n + (r.message_count ?? 0), 0);
    if (today >= MAX_USER_MESSAGES_PER_DAY) {
      return Response.json({ error: "You've reached today's planner limit. Our team is happy to help by email or WhatsApp." }, { status: 429 });
    }
    if (!sessionId) {
      const { data } = await db.from("chat_sessions").insert({ ip_hash: ipHash }).select("id").single();
      sessionId = data?.id;
    }
  }

  const client = new Anthropic();
  const system = await buildSystemPrompt();
  const messages: Anthropic.Beta.BetaMessageParam[] = history.map((m) => ({ role: m.role, content: m.content }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: Event) => controller.enqueue(encoder.encode(`${JSON.stringify(e)}\n`));
      let replyText = "";
      let itinerary: DraftItinerary | undefined;
      let inputTokens = 0;
      let outputTokens = 0;
      let jsonRetries = 0;

      if (sessionId) send({ type: "session", id: sessionId });

      try {
        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          const turn = client.beta.messages.stream(
            {
              model: MODEL,
              max_tokens: MAX_TOKENS,
              betas: ["server-side-fallback-2026-07-01"],
              fallbacks: "default",
              output_config: { effort: "low" },
              system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
              tools: TOOLS,
              messages,
            },
            { signal: request.signal }
          );
          turn.on("text", (delta) => {
            replyText += delta;
            send({ type: "text", delta });
          });

          let message: Anthropic.Beta.BetaMessage;
          try {
            message = await turn.finalMessage();
            jsonRetries = 0;
          } catch (error) {
            // With eager input streaming, an unparseable tool input rejects here; retry that turn once.
            if (error instanceof Anthropic.APIError || jsonRetries++ >= 1) throw error;
            continue;
          }
          inputTokens += (message.usage.input_tokens ?? 0) + (message.usage.cache_read_input_tokens ?? 0) + (message.usage.cache_creation_input_tokens ?? 0);
          outputTokens += message.usage.output_tokens ?? 0;

          if (message.stop_reason === "refusal") {
            const sorry = "Sorry, I can't help with that. I'm happy to help plan a trip to Sri Lanka.";
            replyText += sorry;
            send({ type: "text", delta: sorry });
            break;
          }

          const toolUses = message.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
          if (toolUses.length === 0 || message.stop_reason === "end_turn") break;
          if (message.stop_reason === "max_tokens") {
            send({ type: "text", delta: "\n\nSorry, that got too long. Could you narrow it down a little?" });
            break;
          }

          messages.push({ role: "assistant", content: message.content });
          const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
          for (const use of toolUses) {
            send({ type: "tool", name: use.name });
            const outcome = await runPlannerTool(use.name, use.input);
            if (outcome.itinerary) {
              itinerary = outcome.itinerary;
              send({ type: "itinerary", itinerary: outcome.itinerary });
            }
            results.push({ type: "tool_result", tool_use_id: use.id, content: outcome.content, is_error: outcome.isError });
          }
          // All results go back in one user message so parallel tool calls stay parallel.
          messages.push({ role: "user", content: results });
          if (replyText && !replyText.endsWith("\n")) {
            replyText += "\n\n";
            send({ type: "text", delta: "\n\n" });
          }
        }
      } catch (error) {
        if (!request.signal.aborted) {
          console.error("[api/chat]", error);
          const message =
            error instanceof Anthropic.RateLimitError
              ? "The planner is busy right now. Please try again in a minute."
              : "Something went wrong on our side. Please try again, or contact our team.";
          send({ type: "error", message });
        }
      } finally {
        send({ type: "done" });
        controller.close();
        if (db && sessionId) {
          await Promise.all([
            db.from("chat_messages").insert([
              { session_id: sessionId, role: "user", content: { text: last.content } },
              { session_id: sessionId, role: "assistant", content: { text: replyText.trim(), itinerary: itinerary ?? null } },
            ]),
            db.rpc("record_chat_turn", { p_session: sessionId, p_input: inputTokens, p_output: outputTokens }),
          ]).catch((e) => console.error("[api/chat] logging failed:", e));
        }
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
