import { Page } from 'playwright';
import * as dotenv from 'dotenv';
dotenv.config();

export class ProductsPage {
  constructor(private page: Page) {}

  private productSelectors: Record<string, string> = {
    'Sauce Labs Backpack': '[data-test="add-to-cart-sauce-labs-backpack"]',
  };

  async addProduct(productName: string) {
    const selector = this.productSelectors[productName];
    if (!selector) {
      throw new Error(`No selector defined for product: ${productName}`);
    }
    await this.page.click(selector);
  }

  async goToCart() {
    await this.page.click('.shopping_cart_link');
  }
}

