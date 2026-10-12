import { test } from '../fixtures/fixtures';

test('two items added to cart are visible on cart page', async ({ loggedInInventory: inventoryPage, cartPage }) => {
  await inventoryPage.addToCart('Sauce Labs Backpack');
  await inventoryPage.addToCart('Sauce Labs Bike Light');
  await inventoryPage.openCart();

  await cartPage.expectLoaded();
  await cartPage.expectItemCount(2);
  await cartPage.expectItemVisible('Sauce Labs Backpack');
  await cartPage.expectItemVisible('Sauce Labs Bike Light');
});

test('remove item clears cart badge', async ({ loggedInInventory: inventoryPage }) => {
  await inventoryPage.addToCart('Sauce Labs Backpack');
  await inventoryPage.expectCartCount(1);

  await inventoryPage.removeFromCart('Sauce Labs Backpack');
  await inventoryPage.expectCartIsEmpty();
});
