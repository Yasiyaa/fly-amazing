import { NextResponse } from "next/server";
import { sendTourInquiryEmail, TourInquiryData } from "@/lib/emailService";

const TOUR_TYPES: TourInquiryData["tourType"][] = ["custom", "package", "flight", "general"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ITINERARY_STOPS = 30;

function str(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function num(value: unknown, fallback: number, max = 1_000_000): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.min(n, max) : fallback;
}

export async function POST(request: Request) {
  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = str(body.email, 254);
  const phone = str(body.phone, 40);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }

  const tourType = TOUR_TYPES.includes(body.tourType) ? body.tourType : "general";
  const itinerary = Array.isArray(body.itinerary) ? body.itinerary.slice(0, MAX_ITINERARY_STOPS) : [];

  const payload: TourInquiryData = {
    // Reference format FA-SL-XXXX (always generated server-side)
    inquiryId: `FA-SL-${Math.floor(1000 + Math.random() * 9000)}`,
    fullName: str(body.fullName, 120) || "Not provided",
    email,
    phone,
    departureCity: str(body.departureCity, 80) || "Not specified",
    travelDates: {
      startDate: str(body.travelDates?.startDate, 80) || "Flexible",
      endDate: str(body.travelDates?.endDate, 80) || undefined,
    },
    travelers: {
      adults: num(body.travelers?.adults, 2, 50),
      children: num(body.travelers?.children, 0, 50),
    },
    tourType,
    packageName: str(body.packageName, 160) || undefined,
    estimatedBudgetAUD: num(body.estimatedBudgetAUD, 0),
    itinerary: itinerary.map((item: Record<string, unknown>) => ({
      destinationId: str(item?.destinationId, 60),
      destinationName: str(item?.destinationName, 120),
      nights: num(item?.nights, 0, 60),
      hotelId: str(item?.hotelId, 60) || undefined,
      hotelName: str(item?.hotelName, 160) || undefined,
      roomType: str(item?.roomType, 120) || undefined,
      pricePerNightAUD: item?.pricePerNightAUD !== undefined ? num(item.pricePerNightAUD, 0, 100_000) : undefined,
    })),
    specialRequests: str(body.specialRequests, 2000),
  };

  try {
    const result = await sendTourInquiryEmail(payload);
    return NextResponse.json({ success: true, inquiryId: result.inquiryId });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "We couldn't send your enquiry right now. Please call us on 1300 359 269." },
      { status: 500 }
    );
  }
}
