import { test } from '../fixtures/fixtures';

test('Products heading is visible', async ({ loggedInInventory: inventoryPage }) => {
  await inventoryPage.open();
  await inventoryPage.expectProductsVisible();
});

test('sorting Z to A changes first item in list', async ({ loggedInInventory: inventoryPage }) => {
  await inventoryPage.open();
  await inventoryPage.expectFirstProduct('Sauce Labs Backpack');
  await inventoryPage.sortBy('za');
  await inventoryPage.expectFirstProduct('Test.allTheThings() T-Shirt (Red)');
});
