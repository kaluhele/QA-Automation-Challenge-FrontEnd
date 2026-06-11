import { Before, After, Status, BeforeAll, AfterAll } from '@cucumber/cucumber';
import playwright from 'playwright';
import { CustomWorld } from './world.ts';
import { allure } from 'allure-playwright';

Before({ tags: '@skip' }, async function () {
  return 'skipped';
});

Before(async function (this: CustomWorld, { pickle }) {
  this.browser = await playwright.chromium.launch({ headless: true });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  allure.label('feature', pickle.uri.split('/').pop()?.replace('.feature', '') || '');
  allure.label('story', pickle.name);
});

After(async function (this: CustomWorld, { result, pickle }) {
  if (this.page) {
    const scenarioName = pickle.name.replace(/\s+/g, '_');

    if (result?.status === Status.FAILED) {
      const screenshot = await this.page.screenshot({ fullPage: true });
      allure.attachment('Screenshot on failure', screenshot, 'image/png');
      await this.captureErrorScreenshot(scenarioName);
    } else {
      await this.captureScreenshot(scenarioName);
    }
  }

  if (this.browser) {
    await this.browser.close();
  }
});