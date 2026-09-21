import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected abstract readonly path: string;
  constructor(protected readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${this.path}$`));
  }

  protected byTestId(id: string): Locator {
    return this.page.locator(`[data-test="${id}"]`);
  }
}
