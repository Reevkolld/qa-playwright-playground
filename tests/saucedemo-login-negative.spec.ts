import { test, expect } from '@playwright/test';

test('negative test case - wrong password', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('qwe123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(
    page.getByText('Epic sadface: Username and password do not match any user in this service'),
  ).toBeVisible();
});

test('negative test case - locked user', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Epic sadface: Sorry, this user has been locked out.')).toBeVisible();
});
