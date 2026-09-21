import { expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductDetailsPage extends BasePage {
  protected readonly url = 'https://www.saucedemo.com/inventory-item.html';

  async expectLoaded(productId?: number): Promise<void> {
    const expectedUrl = productId === undefined ? this.url : `${this.url}?id=${productId}`;
    await expect(this.page).toHaveURL(expectedUrl);
    await expect(this.page.getByRole('button', { name: 'Back to products' })).toBeVisible();
  }

  async expectProductVisible(name: string): Promise<void> {
    await expect(this.byTestId('inventory-item-name')).toHaveText(name);
  }

  async addToCart(): Promise<void> {
    await this.page.getByRole('button', { name: 'Add to cart' }).click();
  }

  async expectAddedToCart(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Remove' })).toBeVisible();
  }

  async expectCartCount(count: number): Promise<void> {
    await expect(this.byTestId('shopping-cart-badge')).toHaveText(String(count));
  }
}
