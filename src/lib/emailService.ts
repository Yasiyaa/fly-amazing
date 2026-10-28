import nodemailer from "nodemailer";

export interface TourInquiryData {
  inquiryId: string;
  fullName: string;
  email: string;
  phone: string;
  departureCity: string;
  travelDates: {
    startDate: string;
    endDate?: string;
  };
  travelers: {
    adults: number;
    children: number;
  };
  tourType: "custom" | "package" | "flight" | "general";
  packageName?: string;
  estimatedBudgetAUD: number;
  itinerary: Array<{
    destinationId: string;
    destinationName: string;
    nights: number;
    hotelId?: string;
    hotelName?: string;
    roomType?: string;
    pricePerNightAUD?: number;
  }>;
  specialRequests?: string;
}

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escape user-supplied text before it is placed in the email HTML. */
function esc(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

const TOUR_TYPE_LABELS: Record<TourInquiryData["tourType"], string> = {
  custom: "Bespoke custom journey (Tour Architect)",
  package: "Curated package",
  flight: "Flights only",
  general: "General enquiry",
};

export async function sendTourInquiryEmail(data: TourInquiryData) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "yasithvidusara@gmail.com";
  
  // Create HTML body for Admin
  const itineraryHtml = data.itinerary
    .map(
      (item, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 16px; font-weight: 600; color: #033f7e;">Stop ${idx + 1}: ${esc(item.destinationName)}</td>
        <td style="padding: 12px 16px; color: #475569;">${item.nights} Night${item.nights > 1 ? "s" : ""}</td>
        <td style="padding: 12px 16px; color: #01a4a9; font-weight: 500;">${esc(item.hotelName || "Standard Boutique Stay")} (${esc(item.roomType || "Standard Suite")})</td>
        <td style="padding: 12px 16px; color: #e66017; font-weight: 600; text-align: right;">${item.pricePerNightAUD ? `$${item.pricePerNightAUD * item.nights} AUD` : "Included"}</td>
      </tr>
    `
    )
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px; }
        .card { background: #ffffff; max-width: 680px; margin: 0 auto; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(3, 63, 126, 0.1); }
        .header { background: linear-gradient(135deg, #033f7e 0%, #01a4a9 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0 0 6px 0; font-size: 24px; letter-spacing: -0.5px; }
        .header p { margin: 0; color: #e0f7f8; font-size: 14px; }
        .badge { display: inline-block; background: #e66017; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-top: 12px; }
        .content { padding: 32px 24px; }
        .section-title { font-size: 16px; font-weight: 700; color: #033f7e; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #01a4a9; padding-bottom: 6px; margin: 24px 0 16px 0; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; }
        .info-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-bottom: 4px; }
        .info-value { font-size: 15px; font-weight: 600; color: #0f172a; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th { background: #f1f5f9; text-align: left; padding: 10px 16px; font-size: 12px; font-weight: 600; color: #475569; }
        .total-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin-top: 24px; display: flex; justify-content: space-between; align-items: center; }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>✈️ New Sri Lanka Tour Dossier</h1>
          <p>Fly Amazing — Australia to Sri Lanka Travel System</p>
          <div class="badge">Reference: ${esc(data.inquiryId)}</div>
        </div>
        
        <div class="content">
          <div class="section-title">Client Details</div>
          <div class="info-grid">
            <div class="info-box">
              <div class="info-label">Full Name</div>
              <div class="info-value">${esc(data.fullName)}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Contact Email</div>
              <div class="info-value"><a href="mailto:${esc(data.email)}" style="color: #033f7e;">${esc(data.email)}</a></div>
            </div>
            <div class="info-box">
              <div class="info-label">Australian Phone</div>
              <div class="info-value"><a href="tel:${esc(data.phone)}" style="color: #033f7e;">${esc(data.phone)}</a></div>
            </div>
            <div class="info-box">
              <div class="info-label">Departure Airport</div>
              <div class="info-value">${esc(data.departureCity)} &rarr; Colombo (CMB)</div>
            </div>
            <div class="info-box">
              <div class="info-label">Travel Window</div>
              <div class="info-value">${esc(data.travelDates.startDate)} ${data.travelDates.endDate ? `to ${esc(data.travelDates.endDate)}` : ""}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Party Size</div>
              <div class="info-value">${data.travelers.adults} Adult${data.travelers.adults > 1 ? "s" : ""} ${data.travelers.children > 0 ? `, ${data.travelers.children} Children` : ""}</div>
            </div>
          </div>

          <div class="section-title">Tour Selection & Itinerary</div>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569;">
            <strong>Type:</strong> ${esc(TOUR_TYPE_LABELS[data.tourType])}${data.packageName ? `: ${esc(data.packageName)}` : ""}
          </p>

          <table>
            <thead>
              <tr>
                <th>Destination / Stop</th>
                <th>Duration</th>
                <th>Selected Accommodation</th>
                <th style="text-align: right;">Est. Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itineraryHtml}
            </tbody>
          </table>

          <div class="total-box">
            <span style="font-weight: 600; color: #033f7e; font-size: 15px;">Estimated Total Trip Valuation:</span>
            <span style="font-size: 22px; font-weight: 800; color: #e66017;">$${data.estimatedBudgetAUD.toLocaleString()} AUD</span>
          </div>

          ${
            data.specialRequests
              ? `
            <div class="section-title">Client Notes / Special Requests</div>
            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; font-size: 14px; color: #92400e;">
              ${esc(data.specialRequests)}
            </div>
          `
              : ""
          }
        </div>

        <div class="footer">
          <p style="margin: 0 0 4px 0;">Fly Amazing Australia &bull; Registered Travel Concierge</p>
          <p style="margin: 0;">Automated lead delivery to ${adminEmail}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Check if SMTP is configured, else log to console for development
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Fly Amazing Bookings" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: adminEmail,
      replyTo: data.email,
      subject: `[New enquiry ${data.inquiryId}] ${data.fullName} - ${data.departureCity} to Sri Lanka`,
      html: emailHtml,
    });
  } else {
    // Development / fallback logging
    console.log("=================================================");
    console.log(`[EMAIL DISPATCH SIMULATION] Sent to: ${adminEmail}`);
    console.log(`Reference: ${data.inquiryId} for ${data.fullName}`);
    console.log(`Estimated Total: $${data.estimatedBudgetAUD} AUD`);
    console.log("=================================================");
  }

  return {
    success: true,
    inquiryId: data.inquiryId,
    dispatchedTo: adminEmail,
  };
}
