import { test, expect } from '@playwright/test';
import { byTestId } from './utils/by-test-id';

test('two items added to cart are visible on cart page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  await byTestId(page, 'add-to-cart-sauce-labs-backpack').click();
  await byTestId(page, 'add-to-cart-sauce-labs-bike-light').click();

  await byTestId(page, 'shopping-cart-link').click();

  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
});

test('remove item clears cart badge', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await byTestId(page, 'add-to-cart-sauce-labs-backpack').click();
  await expect(byTestId(page, 'shopping-cart-badge')).toHaveText('1');

  await byTestId(page, 'remove-sauce-labs-backpack').click();
  await expect(byTestId(page, 'shopping-cart-badge')).not.toBeVisible();
});

test('sorting Z to A changes first item in list', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(byTestId(page, 'inventory-item-sauce-labs-backpack-img')).toBeVisible();
  await expect(page.locator('.inventory_item').first()).toContainText('Sauce Labs Backpack');

  await byTestId(page, 'product-sort-container').selectOption('za');
  await expect(page.locator('.inventory_item').first()).toContainText(
    'Test.allTheThings() T-Shirt (Red)',
  );
});
