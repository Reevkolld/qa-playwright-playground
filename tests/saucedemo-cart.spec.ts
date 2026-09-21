import { test } from '@playwright/test';
import { CartPage } from '../pages/cart.page';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

test('two items added to cart are visible on cart page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.expectLoaded();

  await inventoryPage.addToCart('Sauce Labs Backpack');
  await inventoryPage.addToCart('Sauce Labs Bike Light');
  await inventoryPage.openCart();

  await cartPage.expectLoaded();
  await cartPage.expectItemCount(2);
  await cartPage.expectItemVisible('Sauce Labs Backpack');
  await cartPage.expectItemVisible('Sauce Labs Bike Light');
});

test('remove item clears cart badge', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addToCart('Sauce Labs Backpack');
  await inventoryPage.expectCartCount(1);

  await inventoryPage.removeFromCart('Sauce Labs Backpack');
  await inventoryPage.expectCartIsEmpty();
});
