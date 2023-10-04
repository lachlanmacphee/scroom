import { test, expect } from "@playwright/test";

test("edit icon appears", async ({ page }) => {
  await page.goto("/team");
  await expect(page.getByTestId("editTeamDetailsButton")).toBeVisible();
});

test("changing team and project name", async ({ page }) => {
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

test("reset button enables once input field correct", async ({ page }) => {
  await page.goto("/team");
  await page.getByTestId("resetTeamButton").click();
  await expect(page.getByTestId("resetTeamButton")).toBeDisabled();
  await page.getByTestId("resetConfirmField").fill("reset");
  await expect(page.getByTestId("resetTeamButton")).toBeEnabled();
});

test("leave team button enables once input field correct", async ({ page }) => {
  await page.goto("/team");
  await page.getByTestId("leaveTeamButton").click();
  await expect(page.getByTestId("leaveTeamButton")).toBeDisabled();
  await page.getByTestId("leaveConfirmField").fill("leave");
  await expect(page.getByTestId("leaveTeamButton")).toBeEnabled();
});

test("admin remove member button enables once input field correct", async ({
  page,
}) => {
  await page.goto("/team");
  await page.getByTestId("removeMemberButton").click();
  await expect(page.getByTestId("removeMemberButton")).toBeDisabled();
  await page.getByTestId("removeConfirmField").fill("remove");
  await expect(page.getByTestId("removeMemberButton")).toBeEnabled();
});
