import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BALANCE_DUE_DAYS, DEPOSIT_RATE } from "@/lib/pricing";
import { COMPANY } from "@/lib/site";

export const metadata: Metadata = { title: "Booking terms" };

// Draft terms based on common practice among Sri Lankan inbound operators. The client must review
// and approve the final wording before launch (spec decision 8).
const CANCELLATION = [
  ["91 days or more before arrival", "Deposit is non-refundable"],
  ["61–90 days", "30% of the tour price"],
  ["31–60 days", "60% of the tour price"],
  ["15–30 days", "90% of the tour price"],
  ["14 days or less", "100% of the tour price"],
];

export default function BookingTermsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container-page pb-24 pt-[120px] sm:pt-[140px]">
        <article className="card mx-auto max-w-3xl p-6 sm:p-10">
          <p className="eyebrow">Booking terms</p>
          <h1 className="mt-3 text-3xl font-bold text-fly-navy-900 sm:text-4xl">How booking works</h1>
          <p className="mt-4 text-slate-600">
            These terms apply to tours arranged by {COMPANY.name}, Colombo, Sri Lanka. Prices are quoted and charged in US dollars.
          </p>

          <h2 className="mt-10 text-xl font-bold text-fly-navy-900">1. Requests and confirmation</h2>
          <p className="mt-3 text-slate-600">
            Sending a booking request doesn&rsquo;t commit you to pay. We check guide, vehicle and hotel availability and send a written confirmation with your final price. Your booking is confirmed once you accept it and pay the deposit.
          </p>

          <h2 className="mt-8 text-xl font-bold text-fly-navy-900">2. Payment</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
            <li>A deposit of {DEPOSIT_RATE * 100}% confirms a multi-day tour.</li>
            <li>The balance is due {BALANCE_DUE_DAYS} days before arrival. Bookings made within {BALANCE_DUE_DAYS} days of arrival are paid in full.</li>
            <li>Day tours are paid in full on confirmation.</li>
            <li>We accept bank transfer and card payment by secure payment link. Bank and card fees are your responsibility.</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold text-fly-navy-900">3. Cancellation by you</h2>
          <p className="mt-3 text-slate-600">Cancellations must be made in writing. These charges apply:</p>
          <table className="mt-4 w-full text-left text-sm">
            <tbody className="divide-y divide-slate-100">
              {CANCELLATION.map(([when, charge]) => (
                <tr key={when}>
                  <td className="py-3 pr-4 text-slate-600">{when}</td>
                  <td className="py-3 font-medium text-slate-900">{charge}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="mt-8 text-xl font-bold text-fly-navy-900">4. Changes</h2>
          <p className="mt-3 text-slate-600">
            We&rsquo;re happy to change dates, hotels or routes where we can. Any difference in price is confirmed in writing before the change is made.
          </p>

          <h2 className="mt-8 text-xl font-bold text-fly-navy-900">5. Travel documents and insurance</h2>
          <p className="mt-3 text-slate-600">
            You&rsquo;re responsible for a valid passport, a Sri Lanka ETA (visa) and comprehensive travel insurance. We strongly recommend insurance that covers cancellation.
          </p>

          <h2 className="mt-8 text-xl font-bold text-fly-navy-900">6. Prices</h2>
          <p className="mt-3 text-slate-600">
            Prices shown on the website are per person in USD for the hotel standard selected and are estimates until confirmed in writing. Conversions into other currencies are approximate.
          </p>

          <p className="mt-10 border-t border-slate-100 pt-6 text-sm text-slate-500">Questions about these terms? Email info@amazingworldtravel.com.</p>
        </article>
      </div>
      <Footer />
    </main>
  );
}
