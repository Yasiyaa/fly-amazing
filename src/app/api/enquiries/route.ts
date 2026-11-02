import { NextResponse } from "next/server";
import { enquirySchema, firstError } from "@/lib/validation";
import { createEnquiry } from "@/lib/bookings";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  if (!rateLimit(`enquiry:${clientIp(request)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
  }

  const parsed = enquirySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });

  try {
    const { website: _honeypot, ...input } = parsed.data;
    const { reference } = await createEnquiry(input);
    return NextResponse.json({ reference });
  } catch (error) {
    console.error("[api/enquiries]", error);
    return NextResponse.json({ error: "We couldn't send your message right now. Please email info@amazingworldtravel.com." }, { status: 500 });
  }
}
