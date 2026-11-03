import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  contactSchema,
  tourBookingSchema,
  customBookingSchema,
  enquirySchema,
  lookupSchema,
} from "../src/lib/validation.ts";

describe("Validation Schemas", () => {
  test("contactSchema validates valid and invalid contact data", () => {
    const valid = contactSchema.safeParse({
      name: "Supun Fernando",
      email: "supun@example.com",
      phone: "+94 77 123 4567",
      country: "Sri Lanka",
    });
    assert.equal(valid.success, true);

    const invalidEmail = contactSchema.safeParse({
      name: "Supun",
      email: "not-an-email",
      phone: "+94 77 123 4567",
    });
    assert.equal(invalidEmail.success, false);

    const shortPhone = contactSchema.safeParse({
      name: "Supun",
      email: "supun@example.com",
      phone: "123", // under 7 digits
    });
    assert.equal(shortPhone.success, false);
  });

  test("tourBookingSchema enforces valid tour fields and honeypot", () => {
    const valid = tourBookingSchema.safeParse({
      kind: "tour",
      tourSlug: "grand-tour-of-sri-lanka",
      tier: "superior",
      adults: 2,
      children: 1,
      startDate: "2027-02-15",
      name: "Alice Smith",
      email: "alice@example.com",
      phone: "+44 7911 123456",
    });
    assert.equal(valid.success, true);

    // Bot filling honeypot fails
    const bot = tourBookingSchema.safeParse({
      kind: "tour",
      tourSlug: "grand-tour-of-sri-lanka",
      tier: "superior",
      adults: 2,
      startDate: "2027-02-15",
      name: "Bot",
      email: "bot@example.com",
      phone: "+44 7911 123456",
      website: "https://spam.com",
    });
    assert.equal(bot.success, false);
  });

  test("customBookingSchema validates stops structure", () => {
    const valid = customBookingSchema.safeParse({
      kind: "custom",
      title: "My custom tour",
      stops: [
        { destinationId: "sigiriya", nights: 2 },
        { destinationId: "ella", nights: 2, hotelId: "98-acres" },
      ],
      adults: 2,
      children: 0,
      name: "Bob Jones",
      email: "bob@example.com",
      phone: "+1 555 123 4567",
    });
    assert.equal(valid.success, true);

    // Empty stops array fails
    const emptyStops = customBookingSchema.safeParse({
      kind: "custom",
      stops: [],
      adults: 2,
      name: "Bob",
      email: "bob@example.com",
      phone: "+1 555 123 4567",
    });
    assert.equal(emptyStops.success, false);
  });

  test("lookupSchema enforces AWT-XXXXX format", () => {
    const valid = lookupSchema.safeParse({
      reference: "AWT-7K2QX",
      email: "alice@example.com",
    });
    assert.equal(valid.success, true);

    const invalidRef = lookupSchema.safeParse({
      reference: "INVALID-REF",
      email: "alice@example.com",
    });
    assert.equal(invalidRef.success, false);
  });

  test("enquirySchema validates message minimum length", () => {
    const valid = enquirySchema.safeParse({
      name: "David",
      email: "david@example.com",
      message: "Hello! We would like to plan a 10 day tour in March.",
    });
    assert.equal(valid.success, true);

    const shortMsg = enquirySchema.safeParse({
      name: "David",
      email: "david@example.com",
      message: "Hi", // too short
    });
    assert.equal(shortMsg.success, false);
  });
});
