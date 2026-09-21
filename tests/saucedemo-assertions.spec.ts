import { test } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

test('login value, products visible, inventory count', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.fillCredentials('standard_user', 'secret_sauce');
  await loginPage.expectUsernameValue('standard_user');
  await loginPage.submit();

  await inventoryPage.expectProductsVisible();
  await inventoryPage.expectProductCount(6);
});
