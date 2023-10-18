import { test, expect } from '@playwright/test';

test('Creating a new sprint ', async ({ page }) => {
  await page.goto("/backlog");
  await page.getByRole('button').nth(1).click();
  await page.getByTestId('newSprintName').click();
  await page.getByTestId('newSprintName').fill('new sprint');
  await page.getByTestId('NewStartDate').fill('2024-01-01');
  await page.getByTestId('NewEndDate').fill('2024-01-30');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByTestId('sprintDropDown').click();
  await expect(page.getByText("new sprint")).toBeVisible(); 
});