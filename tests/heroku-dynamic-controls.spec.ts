import { test, expect } from '@playwright/test';

test.describe('heroku: dynamic_controls - Remove/add', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_controls');
  });

  test('Remove checkbox', async ({ page }) => {
    await page.getByRole('checkbox').check();
    await expect(page.getByRole('checkbox')).toBeChecked();

    await page.getByRole('button', { name: 'Remove' }).click();

    await expect(page.getByRole('checkbox')).not.toBeVisible();
});

  test('Add checkbox', async ({ page }) => {
    await page.getByRole('checkbox').check();
    await expect(page.getByRole('checkbox')).toBeChecked();

    await page.getByRole('button', { name: 'Remove' }).click();

    await expect(page.getByRole('checkbox')).not.toBeVisible();
    await expect(page.getByText('It\'s gone!')).toBeVisible();

    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('It\'s back!')).toBeVisible();
    await expect(page.getByText('A checkbox')).toBeVisible();
    await expect(page.getByRole('checkbox')).not.toBeChecked();
});

});


test.describe('heroku: dynamic_controls - Enable/disable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_controls');
  });

test('textbox is disabled by default', async ({ page }) => {
  await expect(page.getByRole('textbox')).not.toBeEnabled();
});

test('enabling the textbox allows typing', async ({ page }) => {
  await page.getByRole('button', { name: 'Enable' }).click();
  await expect(page.getByRole('textbox')).toBeEnabled();
  await page.getByRole('textbox').fill('qwe');
  await expect(page.getByRole('textbox')).toHaveValue('qwe');
});

test('disabling the textbox after enabling', async ({ page }) => {
  await page.getByRole('button', { name: 'Enable' }).click();
  await expect(page.getByRole('textbox')).toBeEnabled();
  await page.getByRole('button', { name: 'Disable' }).click();

  await expect(page.getByText('It\'s disabled!')).toBeVisible();
  await expect(page.getByRole('textbox')).not.toBeEnabled();
});

});