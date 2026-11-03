import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);

export const contactSchema = z.object({
  name: text(120).min(2, "Please enter your name."),
  email: z.string().trim().max(254).email("Please enter a valid email address."),
  phone: text(40).refine((v) => v.replace(/\D/g, "").length >= 7, "Please enter a valid phone number."),
  country: text(80).optional().default(""),
});

export const tourBookingSchema = contactSchema.extend({
  kind: z.literal("tour"),
  tourSlug: z.string().regex(/^[a-z0-9-]+$/).max(120),
  tier: z.enum(["comfort", "superior", "luxury"]),
  adults: z.coerce.number().int().min(1).max(30),
  children: z.coerce.number().int().min(0).max(30).default(0),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a start date."),
  notes: text(2000).optional().default(""),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});

export const customBookingSchema = contactSchema.extend({
  kind: z.enum(["custom", "planner"]),
  title: text(160).optional(),
  stops: z
    .array(z.object({ destinationId: z.string().max(60), nights: z.coerce.number().int().min(1).max(14), hotelId: z.string().max(80).optional() }))
    .min(1)
    .max(15),
  adults: z.coerce.number().int().min(1).max(30),
  children: z.coerce.number().int().min(0).max(30).default(0),
  vehicle: text(60).optional().default(""),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  notes: text(2000).optional().default(""),
  website: z.string().max(0).optional(),
});

export const bookingRequestSchema = z.discriminatedUnion("kind", [tourBookingSchema, customBookingSchema]);

export const enquirySchema = z.object({
  name: text(120).min(2, "Please enter your name."),
  email: z.string().trim().max(254).email("Please enter a valid email address."),
  phone: text(40).optional().default(""),
  message: text(4000).min(10, "Please tell us a little more."),
  website: z.string().max(0).optional(),
});

export const lookupSchema = z.object({
  reference: z.string().trim().toUpperCase().regex(/^AWT-[A-Z0-9]{5}$/, "References look like AWT-7K2QX."),
  email: z.string().trim().max(254).email(),
});

export function firstError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Please check the form and try again.";
}
