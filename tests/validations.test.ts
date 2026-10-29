import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { productSchema, orderSchema, reviewSchema, customerRegisterSchema } from "../lib/validations";

describe("productSchema", () => {
  it("accepts valid product", () => {
    const r = productSchema.safeParse({ name: "Candle", description: "Desc", price: 100 });
    assert.equal(r.success, true);
  });
  it("rejects negative price", () => {
    const r = productSchema.safeParse({ name: "Candle", description: "Desc", price: -1 });
    assert.equal(r.success, false);
  });
});

describe("orderSchema", () => {
  it("accepts valid order", () => {
    const r = orderSchema.safeParse({
      customerName: "Ivan",
      customerEmail: "a@b.com",
      customerPhone: "+79990000000",
      customerAddress: "Addr",
      items: [{ productId: "p1", productName: "Candle", quantity: 1, price: 100 }],
    });
    assert.equal(r.success, true);
  });
  it("rejects empty items", () => {
    const r = orderSchema.safeParse({
      customerName: "Ivan",
      customerEmail: "a@b.com",
      customerPhone: "+79990000000",
      customerAddress: "Addr",
      items: [],
    });
    assert.equal(r.success, false);
  });
});

describe("reviewSchema", () => {
  it("rejects rating out of range", () => {
    const r = reviewSchema.safeParse({ productId: "p1", authorName: "Ivan", rating: 6, text: "hi" });
    assert.equal(r.success, false);
  });
});

describe("customerRegisterSchema", () => {
  it("rejects short password", () => {
    const r = customerRegisterSchema.safeParse({ email: "a@b.com", password: "123" });
    assert.equal(r.success, false);
  });
});
