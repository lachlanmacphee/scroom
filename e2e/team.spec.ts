import { test, expect } from "@playwright/test";

test("edit icon appears", async ({ page }) => {
  await page.goto("/team");
  await expect(page.getByTestId("editTeamDetailsButton")).toBeVisible();
});

test("changing team and project name works", async ({ page }) => {
  await page.goto("/team");
  await page.getByTestId("editTeamDetailsButton").click();
  await page.getByTestId("teamNameField").fill("RevisedTeam");
  await page.getByTestId("projectNameField").fill("RevisedProject");
  await page.getByText("Save").click();
  await expect(page.getByText("RevisedTeam")).toBeVisible();
  await expect(page.getByText("RevisedProject")).toBeVisible();
});

test("admin can see role dropdowns", async ({ page }) => {
  await page.goto("/team");
  await expect(page.getByTestId("roleSelectDropdown")).toBeVisible();
});
