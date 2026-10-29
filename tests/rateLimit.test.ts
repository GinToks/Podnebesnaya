import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getRateLimitKey } from "../lib/rateLimit";

describe("getRateLimitKey", () => {
  it("uses x-real-ip when present", () => {
    const req = new Request("http://localhost/api/x", {
      headers: { "x-real-ip": "1.2.3.4" },
    });
    assert.equal(getRateLimitKey(req, "p"), "p:1.2.3.4");
  });

  it("falls back to last x-forwarded-for entry", () => {
    const req = new Request("http://localhost/api/x", {
      headers: { "x-forwarded-for": "spoofed, 5.6.7.8" },
    });
    assert.equal(getRateLimitKey(req, "p"), "p:5.6.7.8");
  });
});
