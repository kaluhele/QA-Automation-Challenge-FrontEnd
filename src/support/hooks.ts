import { Before, After, Status } from '@cucumber/cucumber';
import playwright from 'playwright';
import { CustomWorld } from './world.ts';

Before({ tags: '@skip' }, async function () {
  return 'skipped';
});

Before(async function (this: CustomWorld) {
  this.browser = await playwright.chromium.launch({ headless: false });
  this.page = await this.browser.newPage();
});

After(async function (this: CustomWorld, { result, pickle }) {
  if (this.page) {
    const scenarioName = pickle.name.replace(/\s+/g, '_');

    if (result?.status === Status.FAILED) {
      await this.captureErrorScreenshot(scenarioName);
    } else {
      await this.captureScreenshot(scenarioName);
    }
  }

  if (this.browser) {
    await this.browser.close();
  }
});