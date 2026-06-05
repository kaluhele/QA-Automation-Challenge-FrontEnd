import { Page } from 'playwright';

export class CheckoutPage {
  constructor(private page: Page) {}

  async fillCheckoutForm(firstName: string, lastName: string, postalCode: string) {
    await this.page.fill('[data-test="firstName"]', firstName);
    await this.page.fill('[data-test="lastName"]', lastName);
    await this.page.fill('[data-test="postalCode"]', postalCode);
    await this.page.click('[data-test="continue"]');
  }

  async finishCheckout() {
    await this.page.click('[data-test="finish"]');
  }

  async getConfirmationMessage(): Promise<string> {
    const message = await this.page.textContent('.complete-header');
    return message ?? ''; // si es null, devolvemos string vacío
  }
}
