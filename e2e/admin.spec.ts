import { test, expect } from "@playwright/test";

test("admin login and tabs", async ({ page }) => {
  await page.goto("/admin/login");
  await page.fill('input[type="password"]', "Vladen23");
  await page.click('button[type="submit"]');
  await page.waitForURL("/admin");
  for (const tab of ["Заказы", "Пользователи", "Аромат дня", "Подарочные карты"]) {
    await page.click(`button:has-text("${tab}")`);
    await expect(page.locator("h1")).toContainText(tab);
  }
});

test("account login button visible", async ({ page }) => {
  await page.goto("/account");
  const btn = page.locator('button[type="submit"]');
  await expect(btn).toBeVisible();
  await expect(btn).toHaveText(/Войти|Зарегистрироваться/);
});