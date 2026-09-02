import { test, expect } from '@playwright/test';

test.describe('heroku: login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
  });

  test('successful login', async ({ page }) => {
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('https://the-internet.herokuapp.com/secure');
    await expect(page.getByText('You logged into a secure area!')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Secure Area', exact: true })).toBeVisible();
    await expect(
      page.getByText('Welcome to the Secure Area. When you are done click logout below.'),
    ).toBeVisible();
  });
  test('incorrect login', async ({ page }) => {});
  test('incorrect password', async ({ page }) => {});
  test('empty fields', async ({ page }) => {});
});
