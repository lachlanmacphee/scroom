import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto("/dailyScrum");
    await page.getByRole('button', { name: '+' }).click();
    await page.getByTestId('yesterday').click();
    await page.getByTestId('yesterday').fill('test');
    await page.getByTestId('today').click();
    await page.getByTestId('today').fill('test');
    await page.getByTestId('blockers').click();
    await page.getByTestId('blockers').fill('test');
    await page.getByTestId('submit-daily-scrum').click();
    await expect(page.getByText("test")).toBeVisible();
    await page.getByTestId("edit-button").click();
    await page.getByTestId('yesterday').click();
    await page.getByTestId('yesterday').fill('test edit modal');
    await page.getByTestId('today').click();
    await page.getByTestId('today').fill('test edit modal');
    await page.getByTestId('blockers').click();
    await page.getByTestId('blockers').fill('test edit modal');
    await page.getByTestId('submit-daily-scrum').click();
    await expect(page.getByText("test edit modal")).toBeVisible();
});