import { test, expect } from '@playwright/test';

test('default state, check first checkbox, uncheck second', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/');

  await page.getByText('Checkboxes').click();

  await expect(page).toHaveURL('https://the-internet.herokuapp.com/checkboxes');

  //by default
  await expect(page.getByRole('checkbox').first()).not.toBeChecked();
  await expect(page.getByRole('checkbox').nth(1)).toBeChecked();

  await page.getByRole('checkbox').first().check();
  await page.getByRole('checkbox').nth(1).uncheck();

  await expect(page.getByRole('checkbox').first()).toBeChecked();
  await expect(page.getByRole('checkbox').nth(1)).not.toBeChecked();
});
