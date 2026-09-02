import { test, expect } from '@playwright/test';

test('select all options', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');

    await page.getByText('Dropdown').click();

    await expect(page).toHaveURL('https://the-internet.herokuapp.com/dropdown');

    await page.locator('#dropdown').selectOption('1');
    await expect(page.getByRole('combobox')).toHaveValue('1');

    await page.locator('#dropdown').selectOption('2');
    await expect(page.getByRole('combobox')).toHaveValue('2');
    

});