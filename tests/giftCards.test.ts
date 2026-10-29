import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { giftCardCheckSchema, giftCardRedeemSchema, giftCardCreateSchema, bannerSchema } from "../lib/validations";

describe("giftCardCheckSchema", () => {
  it("accepts valid code", () => {
    assert.equal(giftCardCheckSchema.safeParse({ code: "GC-ABC" }).success, true);
  });
  it("rejects empty code", () => {
    assert.equal(giftCardCheckSchema.safeParse({ code: "" }).success, false);
  });
});

describe("giftCardRedeemSchema", () => {
  it("accepts valid redeem", () => {
    assert.equal(giftCardRedeemSchema.safeParse({ code: "GC-ABC", amount: 100 }).success, true);
  });
  it("rejects non-positive amount", () => {
    assert.equal(giftCardRedeemSchema.safeParse({ code: "GC-ABC", amount: 0 }).success, false);
  });
});

describe("giftCardCreateSchema", () => {
  it("accepts valid create", () => {
    assert.equal(giftCardCreateSchema.safeParse({ amount: 1000 }).success, true);
  });
  it("rejects fractional amount", () => {
    assert.equal(giftCardCreateSchema.safeParse({ amount: 10.5 }).success, false);
  });
});

describe("bannerSchema", () => {
  it("accepts valid banner", () => {
    assert.equal(bannerSchema.safeParse({ title: "Sale" }).success, true);
  });
  it("rejects empty title", () => {
    assert.equal(bannerSchema.safeParse({ title: "" }).success, false);
  });
});