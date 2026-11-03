import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { PLANNER_TOOLS, runPlannerTool, type DraftItinerary } from "@/lib/planner/tools";
import { buildSystemPrompt } from "@/lib/planner/prompt";
import { getServiceClient } from "@/lib/supabase/clients";
import { clientIp, hashIp, isSameOriginJson, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";
const MAX_TOOL_ROUNDS = 4;
const MAX_TOKENS = 3000;
const MAX_USER_MESSAGES_PER_SESSION = 40;
const MAX_USER_MESSAGES_PER_DAY = 80;
/** Only the most recent part of the conversation is sent to the model, to bound input cost. */
const MAX_HISTORY_MESSAGES = 20;
const MAX_HISTORY_CHARS = 16_000;
/** Global circuit breaker: the planner switches off once this many tokens were used in 24 hours. */
const DAILY_TOKEN_LIMIT = Number(process.env.PLANNER_DAILY_TOKEN_LIMIT) || 3_000_000;

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

const UNAVAILABLE = "The trip planner isn't available right now. Please use the contact form or WhatsApp.";

function trimHistory(history: { role: "user" | "assistant"; content: string }[]) {
  const recent = history.slice(-MAX_HISTORY_MESSAGES);
  let chars = 0;
  const kept: typeof recent = [];
  for (let i = recent.length - 1; i >= 0; i--) {
    chars += recent[i].content.length;
    if (chars > MAX_HISTORY_CHARS && kept.length > 0) break;
    kept.unshift(recent[i]);
  }
  // The conversation sent to the model must start with a user turn.
  while (kept.length > 1 && kept[0].role !== "user") kept.shift();
  return kept;
}

export async function POST(request: Request) {
  if (!isSameOriginJson(request)) return Response.json({ error: "Invalid request." }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: UNAVAILABLE }, { status: 503 });

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

  // Spend controls live in the database. Without it, only the in-memory limiter would apply,
  // so the planner refuses to run in production until the database is configured.
  const db = getServiceClient();
  if (!db && process.env.NODE_ENV === "production") return Response.json({ error: UNAVAILABLE }, { status: 503 });

  const ipHash = hashIp(ip);
  let sessionId: string | undefined;
  if (db) {
    const { data: used } = await db.rpc("planner_tokens_last_day");
    if (Number(used ?? 0) >= DAILY_TOKEN_LIMIT) {
      console.warn("[api/chat] daily token limit reached; planner paused");
      return Response.json({ error: UNAVAILABLE }, { status: 503 });
    }
    // Reuse a session only if it belongs to this visitor; otherwise start a new one.
    if (parsed.data.sessionId) {
      const { data } = await db.from("chat_sessions").select("id").eq("id", parsed.data.sessionId).eq("ip_hash", ipHash).maybeSingle();
      sessionId = data?.id;
    }
    if (!sessionId) {
      const { data, error } = await db.from("chat_sessions").insert({ ip_hash: ipHash }).select("id").single();
      if (error || !data) {
        console.error("[api/chat] session insert failed:", error);
        return Response.json({ error: UNAVAILABLE }, { status: 503 });
      }
      sessionId = data.id;
    }
    // Count this turn before calling the model so parallel requests can't exceed the cap.
    const { data: allowed, error } = await db.rpc("reserve_chat_turn", {
      p_session: sessionId,
      p_ip_hash: ipHash,
      p_daily_limit: MAX_USER_MESSAGES_PER_DAY,
    });
    if (error || !allowed) {
      return Response.json({ error: "You've reached today's planner limit. Our team is happy to help by email or WhatsApp." }, { status: 429 });
    }
  }

  const client = new Anthropic();
  const system = await buildSystemPrompt();
  const messages: Anthropic.Beta.BetaMessageParam[] = trimHistory(history).map((m) => ({ role: m.role, content: m.content }));

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
            db.rpc("record_chat_tokens", { p_session: sessionId, p_input: inputTokens, p_output: outputTokens }),
          ]).catch((e) => console.error("[api/chat] logging failed:", e));
        }
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
