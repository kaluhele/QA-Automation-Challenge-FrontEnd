import { Page } from 'playwright';
import * as dotenv from 'dotenv';
dotenv.config();

export class CartPage {
  constructor(private page: Page) {}

  async getCartItems() {
    return this.page.$$eval('.inventory_item_name', items =>
      items.map(i => i.textContent?.trim() || '')
    );
  }

  async checkout() {
    await this.page.click('[data-test="checkout"]');
  }
}

