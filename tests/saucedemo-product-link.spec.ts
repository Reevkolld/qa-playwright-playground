import { test } from '../fixtures/fixtures';
import { products } from '../data';
import { ProductDetailsPage } from '../pages/product-details.page';

test('test navigation via link click', async ({ page, loggedInInventory: inventoryPage }) => {
  const productDetailsPage = new ProductDetailsPage(page);

  await inventoryPage.open();
  await inventoryPage.openProduct(products.backpack);
  await productDetailsPage.expectLoaded(4);
  await productDetailsPage.expectProductVisible(products.backpack);
});
