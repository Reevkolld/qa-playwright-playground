import { test } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

test('Products heading is visible', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await inventoryPage.expectLoaded();
  await inventoryPage.expectProductsVisible();
});

test('sorting Z to A changes first item in list', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await inventoryPage.expectFirstProduct('Sauce Labs Backpack');
  await inventoryPage.sortBy('za');
  await inventoryPage.expectFirstProduct('Test.allTheThings() T-Shirt (Red)');
});
