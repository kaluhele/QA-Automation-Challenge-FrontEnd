import { Before, After, Status } from '@cucumber/cucumber';
import playwright from 'playwright';
import { CustomWorld } from './world.ts';

Before(async function (this: CustomWorld) {
  this.browser = await playwright.chromium.launch({ headless: false });
  this.page = await this.browser.newPage();
});

After(async function (this: CustomWorld, { result, pickle }) {
  // Capturar screenshot en caso de fallo
  if (result?.status === Status.FAILED) {
    if (this.page) {
      const screenshotName = `FAILED_${pickle.name.replace(/\s+/g, '_')}`;
      await this.captureErrorScreenshot(screenshotName);
    }
  }

  if (this.browser) {
    await this.browser.close();
  }
});
