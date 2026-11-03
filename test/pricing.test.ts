import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  quoteTour,
  estimateCustomTrip,
  fromPrice,
  groupFactor,
  defaultVehicle,
  BALANCE_DUE_DAYS,
  DEPOSIT_RATE,
} from "../src/lib/pricing.ts";

describe("Pricing Engine", () => {
  const mockTour = {
    kind: "tour" as const,
    prices: {
      comfort: 1000,
      superior: 1500,
      luxury: 2500,
    },
  };

  const mockDayTour = {
    kind: "day" as const,
    prices: {
      comfort: 120,
      superior: 150,
      luxury: 200,
    },
  };

  test("group factors scale correctly with adult count", () => {
    assert.equal(groupFactor(1), 1.6); // Solo supplement
    assert.equal(groupFactor(2), 1.0); // Twin share base
    assert.equal(groupFactor(3), 1.0);
    assert.equal(groupFactor(4), 0.9); // Small group discount
    assert.equal(groupFactor(5), 0.9);
    assert.equal(groupFactor(6), 0.85); // 6+ group discount
    assert.equal(groupFactor(10), 0.85);
  });

  test("quoteTour calculates twin-share 2 adults correctly", () => {
    const futureDate = new Date(Date.now() + 100 * 86_400_000).toISOString().slice(0, 10);
    const quote = quoteTour(mockTour, {
      tier: "superior",
      adults: 2,
      children: 0,
      startDate: futureDate,
    });

    assert.equal(quote.perAdultUSD, 1500);
    assert.equal(quote.totalUSD, 3000);
    assert.equal(quote.payInFull, false);
    assert.equal(quote.depositUSD, 750); // 25% of 3000
  });

  test("quoteTour applies child share (60%)", () => {
    const futureDate = new Date(Date.now() + 100 * 86_400_000).toISOString().slice(0, 10);
    const quote = quoteTour(mockTour, {
      tier: "superior",
      adults: 2,
      children: 1,
      startDate: futureDate,
    });

    assert.equal(quote.perAdultUSD, 1500);
    assert.equal(quote.perChildUSD, 900); // 1500 * 0.6 = 900
    assert.equal(quote.totalUSD, 3900); // 3000 + 900
    assert.equal(quote.depositUSD, Math.round(3900 * DEPOSIT_RATE));
  });

  test("quoteTour enforces pay in full within 60 days", () => {
    const nearDate = new Date(Date.now() + 20 * 86_400_000).toISOString().slice(0, 10);
    const quote = quoteTour(mockTour, {
      tier: "comfort",
      adults: 2,
      children: 0,
      startDate: nearDate,
    });

    assert.equal(quote.payInFull, true);
    assert.equal(quote.depositUSD, quote.totalUSD);
  });

  test("day tours always require pay in full and ignore group factors", () => {
    const quote = quoteTour(mockDayTour, {
      tier: "superior",
      adults: 1,
      children: 0,
    });

    assert.equal(quote.perAdultUSD, 150); // No 1.6x solo factor on day tours
    assert.equal(quote.payInFull, true);
    assert.equal(quote.depositUSD, 150);
  });

  test("estimateCustomTrip calculates rooms, transport and service fee", () => {
    const stops = [
      { nights: 2, nightlyUSD: 100 },
      { nights: 3, nightlyUSD: 200 },
    ];
    const estimate = estimateCustomTrip({
      stops,
      adults: 2,
      children: 0,
      vehicle: "car",
    });

    assert.equal(estimate.nights, 5);
    assert.equal(estimate.days, 6);
    assert.equal(estimate.rooms, 1);
    // Accom: (2*100 + 3*200) * 1 room = 800
    assert.equal(estimate.accommodationUSD, 800);
    // Transport: 95 * 6 = 570
    assert.equal(estimate.transportUSD, 570);
    // Service: round((800 + 570) * 0.1) = 137
    assert.equal(estimate.serviceUSD, 137);
    assert.equal(estimate.totalUSD, 800 + 570 + 137);
    assert.equal(estimate.perPersonUSD, Math.round(estimate.totalUSD / 2));
  });

  test("defaultVehicle selects appropriate vehicle for capacity", () => {
    assert.equal(defaultVehicle(2), "car");
    assert.equal(defaultVehicle(4), "suv");
    assert.equal(defaultVehicle(6), "minivan");
    assert.equal(defaultVehicle(8), "van");
  });

  test("fromPrice picks lowest tier price", () => {
    assert.equal(fromPrice(mockTour), 1000);
  });
});
