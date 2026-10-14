import { test } from '../fixtures/fixtures';
import { products } from '../data';

test('two items added to cart are visible on cart page', async ({
  loggedInInventory: inventoryPage,
  cartPage,
}) => {
  await inventoryPage.open();
  await inventoryPage.addToCart(products.backpack);
  await inventoryPage.addToCart(products.bikeLight);
  await inventoryPage.openCart();

  await cartPage.expectLoaded();
  await cartPage.expectItemCount(2);
  await cartPage.expectItemVisible(products.backpack);
  await cartPage.expectItemVisible(products.bikeLight);
});

test('remove item clears cart badge', async ({ loggedInInventory: inventoryPage }) => {
  await inventoryPage.open();
  await inventoryPage.addToCart(products.backpack);
  await inventoryPage.expectCartCount(1);

  await inventoryPage.removeFromCart(products.backpack);
  await inventoryPage.expectCartIsEmpty();
});
