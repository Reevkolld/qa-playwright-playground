import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected abstract readonly url: string;
  constructor(protected readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(this.url);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(this.url);
  }

  protected byTestId(id: string): Locator {
    return this.page.locator(`[data-test="${id}"]`);
  }
}
