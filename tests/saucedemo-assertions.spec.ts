import { test, expect } from '@playwright/test';

test('login value, products visible, inventory count', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  await expect(page.getByPlaceholder('Username')).toHaveValue('standard_user');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Products')).toBeVisible();

  await expect(page.locator('.inventory_item')).toHaveCount(6);
});
