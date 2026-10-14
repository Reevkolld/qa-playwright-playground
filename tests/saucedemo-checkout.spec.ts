import { checkoutDetails, products } from '../data';
import { test } from '../fixtures/fixtures';

test.beforeEach(async ({ loggedInInventory: inventoryPage, cartPage }) => {
  await inventoryPage.open();
  await inventoryPage.addToCart(products.backpack);
  await inventoryPage.openCart();
  await cartPage.checkout();
});

test('submits checkout with valid required details', async ({ checkoutPage }) => {
  await checkoutPage.fillDetails(checkoutDetails());
  await checkoutPage.continue();

  await checkoutPage.expectOverviewLoaded();
});

test('shows first name validation when all required fields are empty', async ({ checkoutPage }) => {
  await checkoutPage.fillDetails(checkoutDetails({ firstName: '', lastName: '', postalCode: '' }));
  await checkoutPage.continue();

  await checkoutPage.expectError('Error: First Name is required');
});

test('shows first name validation when first name is empty', async ({ checkoutPage }) => {
  await checkoutPage.fillDetails(checkoutDetails({ firstName: '' }));
  await checkoutPage.continue();

  await checkoutPage.expectError('Error: First Name is required');
});

test('shows last name validation when last name is empty', async ({ checkoutPage }) => {
  await checkoutPage.fillDetails(checkoutDetails({ lastName: '' }));
  await checkoutPage.continue();

  await checkoutPage.expectError('Error: Last Name is required');
});

test('shows postal code validation when postal code is empty', async ({ checkoutPage }) => {
  await checkoutPage.fillDetails(checkoutDetails({ postalCode: '' }));
  await checkoutPage.continue();

  await checkoutPage.expectError('Error: Postal Code is required');
});

test('shows first name validation when first and last names are empty', async ({
  checkoutPage,
}) => {
  await checkoutPage.fillDetails(checkoutDetails({ firstName: '', lastName: '' }));
  await checkoutPage.continue();

  await checkoutPage.expectError('Error: First Name is required');
});

test('shows first name validation when first name and postal code are empty', async ({
  checkoutPage,
}) => {
  await checkoutPage.fillDetails(checkoutDetails({ firstName: '', postalCode: '' }));
  await checkoutPage.continue();

  await checkoutPage.expectError('Error: First Name is required');
});

test('shows last name validation when last name and postal code are empty', async ({
  checkoutPage,
}) => {
  await checkoutPage.fillDetails(checkoutDetails({ lastName: '', postalCode: '' }));
  await checkoutPage.continue();

  await checkoutPage.expectError('Error: Last Name is required');
});

test('allows a required field containing only spaces', async ({ checkoutPage }) => {
  await checkoutPage.fillDetails(checkoutDetails({ firstName: '   ' }));
  await checkoutPage.expectFirstNameValue('   ');
  await checkoutPage.continue();

  await checkoutPage.expectOverviewLoaded();
});

test('preserves leading and trailing spaces in first name', async ({ checkoutPage }) => {
  const firstName = '  Test  ';
  await checkoutPage.fillDetails(checkoutDetails({ firstName }));

  await checkoutPage.expectFirstNameValue(firstName);
  await checkoutPage.continue();
  await checkoutPage.expectOverviewLoaded();
});
