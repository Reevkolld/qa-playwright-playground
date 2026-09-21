import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  protected readonly path = 'https://www.saucedemo.com/';

  async login(user: string, pass: string): Promise<void> {
    await this.page.getByPlaceholder('Username').fill(user);
    await this.page.getByPlaceholder('Password').fill(pass);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async expectError(text: string | RegExp): Promise<void> {
    await expect(this.page.locator('[data-test="error"]')).toContainText(text);
  }
}