import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { whatsappLink, COMPANY, DEFAULT_SETTINGS } from "../src/lib/site.ts";

describe("Site Utilities & Configuration", () => {
  test("COMPANY object has correct details", () => {
    assert.equal(COMPANY.name, "Amazing World Travel");
    assert.equal(COMPANY.domain, "amazingworldtravel.com");
    assert.equal(COMPANY.url, "https://amazingworldtravel.com");
  });

  test("DEFAULT_SETTINGS has valid contact defaults and hero videos", () => {
    assert.equal(DEFAULT_SETTINGS.email, "info@amazingworldtravel.com");
    assert.equal(Array.isArray(DEFAULT_SETTINGS.address), true);
    assert.equal(DEFAULT_SETTINGS.address.length >= 3, true);
    assert.equal(Array.isArray(DEFAULT_SETTINGS.heroVideos), true);
    assert.equal(DEFAULT_SETTINGS.heroVideos.length, 4);
    for (const v of DEFAULT_SETTINGS.heroVideos) {
      assert.equal(typeof v.url, "string");
      assert.equal(typeof v.poster, "string");
      assert.equal(typeof v.label, "string");
    }
  });

  test("whatsappLink formats clean wa.me URLs", () => {
    assert.equal(whatsappLink("+94 77 123 4567"), "https://wa.me/94771234567");
    assert.equal(
      whatsappLink("+94 77 123 4567", "Hello Sri Lanka"),
      "https://wa.me/94771234567?text=Hello%20Sri%20Lanka"
    );
    assert.equal(whatsappLink(""), null);
    assert.equal(whatsappLink("abc"), null);
    assert.equal(whatsappLink("+1 (555) 234-5678"), "https://wa.me/15552345678");
  });
});
