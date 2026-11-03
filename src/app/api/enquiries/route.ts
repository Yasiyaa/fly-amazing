import { NextResponse } from "next/server";
import { enquirySchema, firstError } from "@/lib/validation";
import { createEnquiry } from "@/lib/bookings";
import { clientIp, isSameOriginJson, rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  if (!isSameOriginJson(request)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const ip = clientIp(request);
  if (!rateLimit(`enquiry:ip:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
  }

  const parsed = enquirySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });

  const { website: _honeypot, ...input } = parsed.data;
  if (!rateLimit(`enquiry:email:${input.email.toLowerCase()}`, 3, 60 * 60_000)) {
    return NextResponse.json(
      { error: "Too many messages for this email address. Please wait an hour." },
      { status: 429 }
    );
  }

  try {
    const { reference } = await createEnquiry(input);
    return NextResponse.json({ reference });
  } catch (error) {
    console.error("[api/enquiries]", error);
    return NextResponse.json({ error: "We couldn't send your message right now. Please email info@amazingworldtravel.com." }, { status: 500 });
  }
}
