import { test } from '@playwright/test';
import { users } from '../data';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

test.use({ storageState: { cookies: [], origins: [] } });

test('login value, products visible, inventory count', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.fillCredentials(users.standard.username, users.standard.password);
  await loginPage.expectUsernameValue(users.standard.username);
  await loginPage.submit();

  await inventoryPage.expectProductsVisible();
  await inventoryPage.expectProductCount(6);
});
