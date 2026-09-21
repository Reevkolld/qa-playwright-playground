import { Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  protected readonly url = 'https://www.saucedemo.com/inventory.html';

  get cartBadge(): Locator {
    return this.byTestId('shopping-cart-badge');
  }

  get productsHeading(): Locator {
    return this.page.getByText('Products', { exact: true });
  }

  get sortSelect(): Locator {
    return this.byTestId('product-sort-container');
  }

  card(name: string): Locator {
    return this.byTestId('inventory-item').filter({ hasText: name });
  }

  items(): Locator {
    return this.byTestId('inventory-item');
  }

  firstCard(): Locator {
    return this.byTestId('inventory-item').first();
  }

  async addToCart(name: string): Promise<void> {
    await this.card(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(name: string): Promise<void> {
    await this.card(name).getByRole('button', { name: 'Remove' }).click();
  }

  async openProduct(name: string): Promise<void> {
    await this.card(name)
      .getByRole('button', { name: `View details for ${name}`, exact: true })
      .last()
      .click();
  }

  async openCart(): Promise<void> {
    await this.byTestId('shopping-cart-link').click();
  }

  async sortBy(value: string): Promise<void> {
    await this.sortSelect.selectOption(value);
  }

  async expectCartCount(count: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async expectCartIsEmpty(): Promise<void> {
    await expect(this.cartBadge).not.toBeVisible();
  }

  async expectProductsVisible(): Promise<void> {
    await expect(this.productsHeading).toBeVisible();
  }

  async expectProductCount(count: number): Promise<void> {
    await expect(this.items()).toHaveCount(count);
  }

  async expectFirstProduct(name: string): Promise<void> {
    await expect(this.firstCard()).toContainText(name);
  }
}
