import { test } from '../fixtures/fixtures';
import { products } from '../data';

test('Products heading is visible', async ({ loggedInInventory: inventoryPage }) => {
  await inventoryPage.open();
  await inventoryPage.expectProductsVisible();
});

test('sorting Z to A changes first item in list', async ({ loggedInInventory: inventoryPage }) => {
  await inventoryPage.open();
  await inventoryPage.expectFirstProduct(products.backpack);
  await inventoryPage.sortBy('za');
  await inventoryPage.expectFirstProduct(products.redTShirt);
});
