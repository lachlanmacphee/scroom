import { test, expect } from '@playwright/test';

test('test-delete-status', async ({ page }) => {
  await page.goto('/board');

  await page.getByTestId("board-toDo").click();
  await page.getByTestId("board-inProgress").click();
  await page.getByTestId("board-done").click();
  await page.locator('#board-toDo').getByRole('button').click();
  await page.getByLabel('Enter new name for the status:').click();
  await page.getByRole('button', { name: 'Update' }).click();
  await page.locator('button').nth(1).click();
  await page.locator('button').nth(1).click();
  await page.locator('#board-column4').getByRole('button').first().click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.locator('#board-column5').getByRole('button').first().click();
  await page.getByLabel('Select a status to move the issues:').selectOption('inProgress');
  await page.getByRole('button', { name: 'Delete' }).click();
});