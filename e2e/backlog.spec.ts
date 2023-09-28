import { test, expect } from "@playwright/test";

test("product owner can see move issue button", async ({ page }) => {
  await page.goto("/backlog");
  await page.getByTestId("addProductIssueButton").click();
  await page.getByTestId("summary").fill("a summary");
  await page.getByText("Save").click();
  await expect(page.getByTestId("moveIssueButton")).toBeVisible();
});
