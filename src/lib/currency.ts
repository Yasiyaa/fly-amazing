/** Display currencies. Bookings are always priced and charged in USD. */
export const CURRENCIES = ["USD", "GBP", "EUR", "AUD", "INR"] as const;
export type Currency = (typeof CURRENCIES)[number];
