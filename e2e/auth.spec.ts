import { test, expect } from "@playwright/test";

test("has signed in", async ({ page }) => {
  await page.goto("/board");
  await expect(page).toHaveURL(/board/);
});

test("has discord provider", async ({ page }) => {
  await page.goto("/api/auth/signin");
  await expect(
    page.locator('button:has-text("Sign in with Discord")'),
  ).toBeVisible();
});

test("has google provider", async ({ page }) => {
  await page.goto("/api/auth/signin");
  await expect(
    page.locator('button:has-text("Sign in with Google")'),
  ).toBeVisible();
});

test("has magic link provider", async ({ page }) => {
  await page.goto("/api/auth/signin");
  await expect(
    page.locator('button:has-text("Sign in with Email")'),
  ).toBeVisible();
});
