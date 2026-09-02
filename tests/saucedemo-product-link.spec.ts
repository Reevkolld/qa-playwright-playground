import { test, expect } from '@playwright/test';

test('test navigation via link click', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'Sauce Labs Backpack' }).first().click();
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');
});
