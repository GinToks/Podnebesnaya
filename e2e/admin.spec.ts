import { test, expect } from "@playwright/test";

test("admin login and tabs", async ({ page }) => {
  await page.goto("/admin/login");
  await page.waitForTimeout(4000);
  const input = page.locator('input[type="password"]');
  await input.waitFor({ state: "visible", timeout: 10000 });
  await input.fill("Vladen23");
  const btn = page.locator('button[type="submit"]');
  await expect(btn).toBeEnabled({ timeout: 10000 });
  await btn.click();
  await page.waitForURL("/admin/catalog", { timeout: 15000 });
  for (const tab of ["/admin/orders", "/admin/users", "/admin/scent-calendar", "/admin/giftcards"]) {
    await page.goto(tab);
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(tab);
  }
});

test("account login button visible", async ({ page }) => {
  await page.goto("/account");
  await page.waitForTimeout(4000);
  const btn = page.locator('button[type="submit"]');
  await expect(btn).toBeVisible({ timeout: 15000 });
  await expect(btn).toHaveText(/Войти|Зарегистрироваться/);
});