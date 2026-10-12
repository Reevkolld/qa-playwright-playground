import { test } from '../fixtures/fixtures';
import { ProductDetailsPage } from '../pages/product-details.page';

test('locate card via filter, add to cart, verify state', async ({ page, loggedInInventory: inventoryPage }) => {
  const productDetailsPage = new ProductDetailsPage(page);

  await inventoryPage.openProduct('Test.allTheThings() T-Shirt (Red)');
  await productDetailsPage.expectLoaded(3);

  await productDetailsPage.addToCart();

  await productDetailsPage.expectCartCount(1);
  await productDetailsPage.expectAddedToCart();
});
