import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { test } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

const authFile = resolve('playwright/.auth/user.json');

test('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.expectLoaded();

  await mkdir(dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});