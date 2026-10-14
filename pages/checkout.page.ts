import { Locator, expect } from '@playwright/test';
import type { CheckoutDetails } from '../data';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  protected readonly url = 'https://www.saucedemo.com/checkout-step-one.html';

  get firstNameField(): Locator {
    return this.page.locator('[data-test="firstName"]');
  }

  get lastNameField(): Locator {
    return this.page.locator('[data-test="lastName"]');
  }

  get postalCodeField(): Locator {
    return this.page.locator('[data-test="postalCode"]');
  }

  async fillDetails(details: CheckoutDetails): Promise<void> {
    await this.firstNameField.fill(details.firstName);
    await this.lastNameField.fill(details.lastName);
    await this.postalCodeField.fill(details.postalCode);
  }

  async continue(): Promise<void> {
    await this.page.locator('[data-test="continue"]').click();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.page.locator('[data-test="error"]')).toContainText(message);
  }

  async expectFirstNameValue(value: string): Promise<void> {
    await expect(this.firstNameField).toHaveValue(value);
  }

  async expectOverviewLoaded(): Promise<void> {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
  }
}
