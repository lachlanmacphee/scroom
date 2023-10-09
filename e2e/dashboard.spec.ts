import { test, expect } from "@playwright/test";

const stepLabel = "Go to next step";

test("onboarding tour start to finish", async ({ page }) => {
  await page.goto("/");

  // Go to step 0
  await page.getByText("Start Tour").click();
  await expect(page.getByText("Welcome to scroom!")).toBeVisible();

  // Go to step 1
  await page.getByLabel(stepLabel).click();
  await expect(page.getByText("This is the dashboard")).toBeVisible();

  // Go to step 2
  await page.getByLabel(stepLabel).click();
  await expect(page.getByText("It shows you")).toBeVisible();

  // Go to step 3
  await page.getByLabel(stepLabel).click();
  await expect(page.getByText("This is the backlog")).toBeVisible();

  // Go to step 4
  await page.getByLabel(stepLabel).click();
  await expect(page.getByText("This is the sprint backlog")).toBeVisible();

  // Go to step 5
  await page.getByLabel(stepLabel).click();
  await expect(page.getByText("Click here to create")).toBeVisible();

  // Go to step 6
  await page.getByLabel(stepLabel).click();
  await expect(page.getByText("This is the product backlog")).toBeVisible();

  // Go to step 7
  await page.getByLabel(stepLabel).click();
  await expect(page.getByText("Click here to create")).toBeVisible();

  // Go to step 8
  await page.getByLabel(stepLabel).click();
  await expect(page.getByText("Let's try adding an issue")).toBeVisible();

  // Go to step 9
  await page.getByTestId("addSprintIssueButton").click();
  await expect(page.getByTestId("summary")).toBeVisible();

  // Fill out form for step 9
  await page.getByTestId("summary").fill("your new issue");
  await page.getByTestId("userId").selectOption({ label: "Unassigned" });
  await page.getByTestId("estimate").fill("5");

  // Go to step 10
  await page.getByText("Save").click();
  await expect(page.getByText("Look, your new issue")).toBeVisible();

  // Go to step 11
  await page.getByLabel(stepLabel).click();
  await expect(page.getByText("This is the scrum board page")).toBeVisible();

  // Go to step 12
  await page.getByLabel(stepLabel).click();
  await expect(
    page.getByText('All of the issues in this column have the "To Do" status'),
  ).toBeVisible();

  // Go to step 13
  await page.getByLabel(stepLabel).click();
  await expect(
    page.getByText("All of the issues in this column are in progress"),
  ).toBeVisible();

  // Go to step 14
  await page.getByLabel(stepLabel).click();
  await expect(
    page.getByText("All of the issues in this column are complete"),
  ).toBeVisible();

  // Go to step 15
  await page.getByLabel(stepLabel).click();
  await expect(page.getByText("Try dragging the issue")).toBeVisible();

  // Go to step 16
  await page.getByLabel(stepLabel).click();
  await expect(page.getByText("This is the team page")).toBeVisible();

  // Go to step 15
  await page.getByLabel(stepLabel).click();
  await expect(page.getByText("That's it, the tour's over")).toBeVisible();

  // End test
  await page.getByLabel("Close Tour").click();
});
