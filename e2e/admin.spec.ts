import { test, expect } from "@playwright/test";

test("admin login and tabs", async ({ page }) => {
  await page.goto("/admin/login");
  await page.fill('input[type="password"]', "Vladen23");
  await page.click('button[type="submit"]');
  await page.waitForURL("/admin/catalog");
  for (const tab of ["/admin/orders", "/admin/users", "/admin/scent-calendar", "/admin/giftcards"]) {
    await page.goto(tab);
    await expect(page).toHaveURL(tab);
  }
});

test("account login button visible", async ({ page }) => {
  await page.goto("/account");
  const btn = page.locator('button[type="submit"]');
  await expect(btn).toBeVisible();
  await expect(btn).toHaveText(/Войти|Зарегистрироваться/);
});