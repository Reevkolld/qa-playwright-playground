import { test, expect } from '@playwright/test';
import { byTestId } from './utils/by-test-id';

test('locate card via filter, add to cart, verify state', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    await page.locator('.inventory_item').filter({hasText: 'Test.allTheThings() T-Shirt (Red)'}).getByText('Test.allTheThings() T-Shirt (Red)').click();


    await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=3');

    await page.getByRole('button', {name: 'Add to cart'}).click();

    await expect(byTestId(page, 'shopping-cart-badge')).toHaveText('1');
    await expect(page.getByRole('button', {name: 'Remove'})).toBeVisible();

});