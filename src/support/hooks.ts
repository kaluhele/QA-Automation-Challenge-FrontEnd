import { Before, After } from '@cucumber/cucumber';
import playwright from 'playwright';
import { CustomWorld } from './world.ts';

Before(async function (this: CustomWorld) {
  this.browser = await playwright.chromium.launch({ headless: false });
  this.page = await this.browser.newPage();
});

After(async function (this: CustomWorld) {
  if (this.browser) {
    await this.browser.close();
  }
});
