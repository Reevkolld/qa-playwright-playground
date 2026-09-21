import { test } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';
import { ProductDetailsPage } from '../pages/product-details.page';

test('test navigation via link click', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const productDetailsPage = new ProductDetailsPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await inventoryPage.openProduct('Sauce Labs Backpack');
  await productDetailsPage.expectLoaded(4);
  await productDetailsPage.expectProductVisible('Sauce Labs Backpack');
});
