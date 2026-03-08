import { test, expect } from "@playwright/test";

test("home page visual regression", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("home.png", {
    fullPage: true,
  });
});
