import { test } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { users } from '../data';
import { LoginPage } from '../pages/login.page';

test.use({ storageState: { cookies: [], origins: [] } });

test('logs in with valid credentials and lands on the inventory page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();

  await loginPage.login(users.standard.username, users.standard.password);

  await inventoryPage.expectLoaded();
});

test('shows an error for a locked out user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(users.lockedOut.username, users.lockedOut.password);

  await loginPage.expectError('Sorry, this user has been locked out');
});

test('shows an error when username is empty', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('', users.standard.password);

  await loginPage.expectError('Username is required');
});

test('shows an error when password is empty', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(users.standard.username, '');

  await loginPage.expectError('Password is required');
});

test('shows an error for invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(users.problem.username, users.problem.password.slice(0, -1));

  await loginPage.expectError('Username and password do not match');
});
