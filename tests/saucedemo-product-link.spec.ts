import { test } from '../fixtures/fixtures';
import { ProductDetailsPage } from '../pages/product-details.page';

test('test navigation via link click', async ({ page, loggedInInventory: inventoryPage }) => {
  const productDetailsPage = new ProductDetailsPage(page);

  await inventoryPage.openProduct('Sauce Labs Backpack');
  await productDetailsPage.expectLoaded(4);
  await productDetailsPage.expectProductVisible('Sauce Labs Backpack');
});
