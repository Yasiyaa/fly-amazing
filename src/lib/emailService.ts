import "server-only";
import nodemailer from "nodemailer";
import { COMPANY } from "./site";

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escape user-supplied text before it is placed in email HTML. */
export function esc(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

const usd = (n: number) => `US$${Math.round(n).toLocaleString("en-US")}`;

/** Private inbox that receives notifications. Never shown to customers. */
export function teamInbox() {
  return process.env.ADMIN_NOTIFICATION_EMAIL || PUBLIC_EMAIL;
}

/** Public contact address used in customer-facing emails. */
const PUBLIC_EMAIL = "info@amazingworldtravel.com";

interface Mail {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends via SMTP when SMTP_HOST, SMTP_USER and SMTP_PASS are all set. Otherwise logs a short
 * summary and returns, so bookings and enquiries never fail just because email isn't configured.
 */
export async function sendMail({ to, subject, html, replyTo }: Mail) {
  if (!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)) {
    console.log(`[email] SMTP not configured. Skipped a ${to === teamInbox() ? "team notification" : "traveller email"}.`);
    return { sent: false };
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({
    from: `"${COMPANY.name}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    replyTo,
    subject,
    html,
  });
  return { sent: true };
}

function layout(title: string, body: string) {
  return `<!doctype html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1e293b">
<div style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
<div style="background:#011a37;padding:24px 28px;color:#fff">
<div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#a3e4e6">${esc(COMPANY.name)}</div>
<h1 style="margin:6px 0 0;font-size:22px">${title}</h1></div>
<div style="padding:28px;font-size:15px;line-height:1.6">${body}</div>
<div style="padding:18px 28px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b">
${esc(COMPANY.name)} · Unit 94D, 75 Galle Road, Colombo 03, Sri Lanka · ${esc(PUBLIC_EMAIL)}</div>
</div></body></html>`;
}

function rows(items: [string, string][]) {
  return `<table style="width:100%;border-collapse:collapse;margin:16px 0">${items
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;color:#64748b;width:40%;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;font-weight:600">${v}</td></tr>`
    )
    .join("")}</table>`;
}

export interface BookingEmailData {
  reference: string;
  tourTitle: string;
  tourSlug?: string | null;
  leadName: string;
  email: string;
  phone: string;
  country: string;
  startDate: string | null;
  adults: number;
  children: number;
  tierLabel: string | null;
  totalUSD: number;
  depositUSD: number;
  payInFull: boolean;
  notes: string;
  itineraryLines: string[];
}

export async function sendBookingEmails(b: BookingEmailData) {
  // If tour is not a verified catalogue tour (custom or planner), do not echo user-supplied free text in the customer auto-reply.
  const customerTripTitle = b.tourSlug ? b.tourTitle : "Custom Sri Lanka itinerary";
  const customerSummary = rows([
    ["Reference", esc(b.reference)],
    ["Trip", esc(customerTripTitle)],
    ["Start date", esc(b.startDate ?? "Flexible")],
    ["Travellers", esc(`${b.adults} adult${b.adults === 1 ? "" : "s"}${b.children ? `, ${b.children} child${b.children === 1 ? "" : "ren"}` : ""}`)],
    ...(b.tierLabel ? ([["Hotels", esc(b.tierLabel)]] as [string, string][]) : []),
    ["Estimated total", esc(usd(b.totalUSD))],
    [b.payInFull ? "Payable in full" : "Deposit to confirm (25%)", esc(usd(b.depositUSD))],
  ]);

  const summary = rows([
    ["Reference", esc(b.reference)],
    ["Trip", esc(b.tourTitle)],
    ["Start date", esc(b.startDate ?? "Flexible")],
    ["Travellers", esc(`${b.adults} adult${b.adults === 1 ? "" : "s"}${b.children ? `, ${b.children} child${b.children === 1 ? "" : "ren"}` : ""}`)],
    ...(b.tierLabel ? ([["Hotels", esc(b.tierLabel)]] as [string, string][]) : []),
    ["Estimated total", esc(usd(b.totalUSD))],
    [b.payInFull ? "Payable in full" : "Deposit to confirm (25%)", esc(usd(b.depositUSD))],
  ]);
  const itinerary = b.itineraryLines.length
    ? `<p style="margin:16px 0 4px;font-weight:600">Itinerary</p><ol style="margin:0;padding-left:18px">${b.itineraryLines
        .map((l) => `<li>${esc(l)}</li>`)
        .join("")}</ol>`
    : "";

  const safeCustomerGreeting = b.leadName && !/[<>@/\\:]/.test(b.leadName) ? `Hi ${esc(b.leadName)},` : "Hi there,";
  const customer = layout(
    "We've received your booking request",
    `<p>${safeCustomerGreeting}</p>
<p>Thank you for choosing ${esc(COMPANY.name)}. A travel specialist will check availability and reply within one business day with your confirmed price and payment options. No payment is taken until you approve the confirmation.</p>
${customerSummary}${itinerary}
<p>You can check the status any time on our website under <strong>Manage booking</strong> using your reference and email.</p>`
  );

  const team = layout(
    `New booking request ${esc(b.reference)}`,
    `${rows([
      ["Name", esc(b.leadName)],
      ["Email", `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>`],
      ["Phone", esc(b.phone)],
      ["Country", esc(b.country || "—")],
    ])}${summary}${itinerary}${b.notes ? `<p style="margin-top:16px;padding:12px;background:#fffbeb;border-radius:8px">${esc(b.notes)}</p>` : ""}`
  );

  await Promise.all([
    sendMail({ to: b.email, subject: `Your booking request ${b.reference} · ${COMPANY.name}`, html: customer }),
    sendMail({ to: teamInbox(), subject: `[Booking ${b.reference}] ${b.leadName} · ${b.tourTitle}`, html: team, replyTo: b.email }),
  ]);
}

export async function sendEnquiryEmails(e: { reference: string; name: string; email: string; phone: string; message: string }) {
  const safeGreeting = e.name && !/[<>@/\\:]/.test(e.name) ? `Hi ${esc(e.name)},` : "Hi there,";
  const customer = layout(
    "Thanks for getting in touch",
    `<p>${safeGreeting}</p><p>We've received your message (reference <strong>${esc(e.reference)}</strong>) and a Sri Lanka specialist will reply within one business day.</p>`
  );
  const team = layout(
    `New enquiry ${esc(e.reference)}`,
    `${rows([
      ["Name", esc(e.name)],
      ["Email", `<a href="mailto:${esc(e.email)}">${esc(e.email)}</a>`],
      ["Phone", esc(e.phone || "—")],
    ])}<p style="padding:12px;background:#f1f5f9;border-radius:8px;white-space:pre-wrap">${esc(e.message)}</p>`
  );
  await Promise.all([
    sendMail({ to: e.email, subject: `We've received your message · ${COMPANY.name}`, html: customer }),
    sendMail({ to: teamInbox(), subject: `[Enquiry ${e.reference}] ${e.name}`, html: team, replyTo: e.email }),
  ]);
}

export async function sendStatusEmail(b: { reference: string; email: string; leadName: string; tourTitle: string; statusLabel: string; message?: string }) {
  const html = layout(
    `Booking ${esc(b.reference)}: ${esc(b.statusLabel)}`,
    `<p>Hi ${esc(b.leadName)},</p><p>The status of your booking for <strong>${esc(b.tourTitle)}</strong> is now <strong>${esc(b.statusLabel)}</strong>.</p>${
      b.message ? `<p style="padding:12px;background:#f1f5f9;border-radius:8px;white-space:pre-wrap">${esc(b.message)}</p>` : ""
    }<p>Reply to this email if you have any questions.</p>`
  );
  await sendMail({ to: b.email, subject: `Booking ${b.reference} · ${b.statusLabel}`, html, replyTo: PUBLIC_EMAIL });
}
