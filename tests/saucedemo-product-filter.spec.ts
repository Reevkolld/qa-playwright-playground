import { test } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';
import { ProductDetailsPage } from '../pages/product-details.page';

test('locate card via filter, add to cart, verify state', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const productDetailsPage = new ProductDetailsPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.expectLoaded();

  await inventoryPage.openProduct('Test.allTheThings() T-Shirt (Red)');
  await productDetailsPage.expectLoaded(3);

  await productDetailsPage.addToCart();

  await productDetailsPage.expectCartCount(1);
  await productDetailsPage.expectAddedToCart();
});
