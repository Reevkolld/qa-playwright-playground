import { Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  protected readonly path = 'https://www.saucedemo.com/cart.html';

  items(): Locator {
    return this.byTestId('inventory-item');
  }

  item(name: string): Locator {
    return this.items().filter({ hasText: name });
  }

  async remove(name: string): Promise<void> {
    await this.items().filter({ hasText: name }).getByRole('button', { name: 'Remove' }).click();
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.items()).toHaveCount(count);
  }
}
