import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('shows an error for a locked out user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('locked_out_user', 'secret_sauce');

  await loginPage.expectError('Sorry, this user has been locked out');
});

test('shows an error when username is empty', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('', 'secret_sauce');

  await loginPage.expectError('Username is required');
});

test('shows an error when password is empty', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', '');

  await loginPage.expectError('Password is required');
});

test('shows an error for invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('invalid_user', 'invalid_password');

  await loginPage.expectError('Username and password do not match');
});