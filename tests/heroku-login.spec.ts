import { test, expect } from '@playwright/test';

const BASE = 'https://the-internet.herokuapp.com';

test.describe('heroku: login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
  });

  test('logs in with valid credentials and lands on the secure area', async ({ page }) => {
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(`${BASE}/secure`);
    await expect(page.getByText('You logged into a secure area!')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Secure Area', exact: true})).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: 'Welcome to the Secure Area. When you are done click logout below.',
      }),
    ).toBeVisible();
  });
  test('rejects an unknown username with an error banner', async ({ page }) => {
    await page.getByLabel('Username').fill('mrsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(`${BASE}/login`);
    await expect(page.getByText('Your username is invalid!')).toBeVisible();
  });
  test('rejects a wrong password for a known username', async ({ page }) => {
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('PublicPassword??');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your password is invalid!')).toBeVisible();
  });
  test('logs out and returns to the login form', async ({ page }) => {
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');

    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(`${BASE}/secure`);

    await page.getByRole('link', { name: 'Logout' }).click();

    await expect(page).toHaveURL(`${BASE}/login`);
    await expect(page.getByText('You logged out of the secure area!')).toBeVisible();
  });
});
