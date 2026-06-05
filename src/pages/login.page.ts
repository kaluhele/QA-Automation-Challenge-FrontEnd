import { Page } from 'playwright';
import * as dotenv from 'dotenv';

dotenv.config();

export class LoginPage {
  private url: string;

  constructor(private page: Page) {
    this.url = process.env.BASE_URL as string;
  }

  async navigate() {
    await this.page.goto(this.url);
  }

  async login(username: string, password: string) {
    await this.page.fill('#user-name', username);
    await this.page.fill('#password', password);
    await this.page.click('#login-button');
  }

  async getErrorMessage() {
    return this.page.textContent('[data-test="error"]');
  }
}
