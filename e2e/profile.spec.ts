import { test, expect } from "@playwright/test";

test("profile page display details and edit modal", async ({ page }) => {
  await page.goto("/profile");
  await page.getByRole("link", { name: "Profile" }).click();
  await page.getByRole("textbox").first().click();
  await page.getByRole("textbox").nth(1).click();
  await page.getByRole("textbox").nth(2).click();
  await page.getByRole("heading").getByRole("button").click();
  await page.locator("#name").click();
  await page.getByRole("button", { name: "Update" }).click();
  await page.getByText("Role:").click();
  await page.getByText("Email:").click();
  await page.getByText("Team:").click();

  await expect(page.getByTestId("user-name")).toBeVisible();
});
