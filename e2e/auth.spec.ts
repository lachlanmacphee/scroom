import { test, expect } from "@playwright/test";

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

test("login with discord", async ({ page }) => {
  await page.goto("/api/auth/signin");
  await page.getByRole("button", { name: "Sign in with Discord" }).click();
  await page.waitForURL("https://discord.com");

  await page.fill('input[type="email"]', "discordusername");
  await page.fill('input[type="password"]', "discordpassword");
  await page.getByRole("button", { name: "Log In" }).click();
  await page.waitForURL("/");

  await expect(page.getByLabel("scroom")).toBeVisible();
});
