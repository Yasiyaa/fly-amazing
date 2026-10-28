import { NextResponse } from "next/server";
import { sendTourInquiryEmail, TourInquiryData } from "@/lib/emailService";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate reference code if not provided
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const inquiryId = body.inquiryId || `FA-SL-${randomNum}`;

    const payload: TourInquiryData = {
      inquiryId,
      fullName: body.fullName || "Valued Aussie Traveler",
      email: body.email,
      phone: body.phone,
      departureCity: body.departureCity || "Melbourne (MEL)",
      travelDates: {
        startDate: body.travelDates?.startDate || "Flexible 2026/2027",
        endDate: body.travelDates?.endDate,
      },
      travelers: {
        adults: Number(body.travelers?.adults) || 2,
        children: Number(body.travelers?.children) || 0,
      },
      tourType: body.tourType || "custom",
      packageName: body.packageName,
      estimatedBudgetAUD: Number(body.estimatedBudgetAUD) || 2500,
      itinerary: body.itinerary || [],
      specialRequests: body.specialRequests || "",
    };

    if (!payload.email || !payload.phone) {
      return NextResponse.json(
        { error: "Email and Australian phone number are required." },
        { status: 400 }
      );
    }

    const result = await sendTourInquiryEmail(payload);

    return NextResponse.json({
      success: true,
      inquiryId: result.inquiryId,
      message: "Tour inquiry successfully dispatched to Fly Amazing admin.",
    });
  } catch (error: any) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process inquiry." },
      { status: 500 }
    );
  }
}
