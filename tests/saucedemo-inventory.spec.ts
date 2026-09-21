import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

test('Products heading is visible', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await inventoryPage.expectLoaded();
  await expect(inventoryPage.productsHeading).toBeVisible();
});

test('sorting Z to A changes first item in list', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(inventoryPage.firstCard()).toContainText('Sauce Labs Backpack');
  await inventoryPage.sortBy('za');
  await expect(inventoryPage.firstCard()).toContainText('Test.allTheThings() T-Shirt (Red)');
});
