import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  protected readonly url = 'https://www.saucedemo.com/';

  async fillCredentials(user: string, pass: string): Promise<void> {
    await this.page.getByPlaceholder('Username').fill(user);
    await this.page.getByPlaceholder('Password').fill(pass);
  }

  async submit(): Promise<void> {
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async login(user: string, pass: string): Promise<void> {
    await this.fillCredentials(user, pass);
    await this.submit();
  }

  async expectUsernameValue(value: string): Promise<void> {
    await expect(this.page.getByPlaceholder('Username')).toHaveValue(value);
  }

  async expectError(text: string | RegExp): Promise<void> {
    await expect(this.page.locator('[data-test="error"]')).toContainText(text);
  }
}
