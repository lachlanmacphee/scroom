import { test, expect } from "@playwright/test";

test("new issue can be added", async ({ page }) => {
  await page.goto("/backlog");
  await page.getByTestId("addSprintIssueButton").click();
  await page.getByTestId("summary").fill("a summary");
  await page.getByTestId("status").selectOption("toDo");
  await page.getByTestId("backlog").selectOption("sprint");
  await page.getByTestId("assignee").selectOption("");
  await page.getByTestId("type").selectOption("task");
  await page.getByTestId("estimate").fill("5");
  await page.getByText("Save").click();
  await expect(page.getByText("a summary")).toBeVisible();
});


