import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  private readonly username: Locator;
  private readonly password: Locator;
  private readonly submit: Locator;
  private readonly error: Locator;

  constructor(private readonly page: Page) {
    this.username = page.getByPlaceholder('Username');
    this.password = page.getByPlaceholder('Password');
    this.submit = page.getByRole('button', { name: 'Login' });
    this.error = page.locator('[data-test="error"]');
  }

  async open(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/'); //надо будет переделать под baseurl
  }

  async login(user: string, pass: string): Promise<void> {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
  }

  async expectError(text: string | RegExp): Promise<void> {
    await expect(this.error).toContainText(text);
  }
}