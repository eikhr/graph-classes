import { test, expect } from "@playwright/test";

test("home page shows graph class cards", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Graph Classes",
  );
  await expect(
    page.getByRole("heading", { name: "Path graph" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Complete graph" }),
  ).toBeVisible();
});

test("clicking a card navigates to class page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("heading", { name: "Path graph" }).click();
  await expect(page).toHaveURL("/classes/path");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Path graph",
  );
});

test("class page has working step navigation", async ({ page }) => {
  await page.goto("/classes/path");
  await expect(page.getByText(/step 1 of/i)).toBeVisible();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText(/step 2 of/i)).toBeVisible();
});

test("class page shows references", async ({ page }) => {
  await page.goto("/classes/path");
  await expect(page.getByText("Wikipedia")).toBeVisible();
});
