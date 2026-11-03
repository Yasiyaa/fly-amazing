import { NextResponse } from "next/server";
import { bookingRequestSchema, firstError } from "@/lib/validation";
import { BookingError, createBooking } from "@/lib/bookings";
import { clientIp, isSameOriginJson, rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  if (!isSameOriginJson(request)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const ip = clientIp(request);
  if (!rateLimit(`booking:ip:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
  const input = parsed.data;

  if (!rateLimit(`booking:email:${input.email.toLowerCase()}`, 3, 60 * 60_000)) {
    return NextResponse.json(
      { error: "Too many booking requests for this email address. Please check your inbox or wait an hour." },
      { status: 429 }
    );
  }

  try {
    const result =
      input.kind === "tour"
        ? await createBooking({ ...input, source: "website" })
        : await createBooking({ ...input, startDate: input.startDate || null, source: input.kind === "planner" ? "ai-planner" : "tour-architect" });
    return NextResponse.json({ reference: result.reference, totalUSD: result.totalUSD, depositUSD: result.depositUSD });
  } catch (error) {
    if (error instanceof BookingError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("[api/bookings]", error);
    return NextResponse.json(
      { error: "We couldn't save your booking right now. Please email info@amazingworldtravel.com." },
      { status: 500 }
    );
  }
}
