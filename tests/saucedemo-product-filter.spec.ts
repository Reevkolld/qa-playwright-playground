import { test } from '../fixtures/fixtures';
import { products } from '../data';
import { ProductDetailsPage } from '../pages/product-details.page';

test('locate card via filter, add to cart, verify state', async ({
  page,
  loggedInInventory: inventoryPage,
}) => {
  const productDetailsPage = new ProductDetailsPage(page);

  await inventoryPage.open();
  await inventoryPage.openProduct(products.redTShirt);
  await productDetailsPage.expectLoaded(3);

  await productDetailsPage.addToCart();

  await productDetailsPage.expectCartCount(1);
  await productDetailsPage.expectAddedToCart();
});
