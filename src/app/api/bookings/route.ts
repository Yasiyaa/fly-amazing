import { NextResponse } from "next/server";
import { bookingRequestSchema, firstError } from "@/lib/validation";
import { BookingError, createBooking } from "@/lib/bookings";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  if (!rateLimit(`booking:${clientIp(request)}`, 5, 10 * 60_000)) {
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
