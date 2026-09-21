import { Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  protected readonly path = 'https://www.saucedemo.com/inventory.html';

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

  firstCard(): Locator {
    return this.byTestId('inventory-item').first();
  }

  async addToCart(name: string): Promise<void> {
    await this.card(name).getByRole('button', { name: 'Add to cart' }).click();
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
}
