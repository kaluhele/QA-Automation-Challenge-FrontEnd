import { setWorldConstructor, IWorldOptions, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import { allure } from 'allure-playwright';
import path from 'path';
import fs from 'fs';

class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  screenshotsPath: string = 'reports/screenshots';

  constructor(options: IWorldOptions) {
    super(options);

    if (!fs.existsSync(this.screenshotsPath)) {
      fs.mkdirSync(this.screenshotsPath, { recursive: true });
    }
  }

  async captureScreenshot(name: string): Promise<void> {
    if (this.page) {
      const filename = `${name.replace(/\s+/g, '_')}.png`;
      const filepath = path.join(this.screenshotsPath, filename);

      const buffer = await this.page.screenshot({ fullPage: true });
      await fs.promises.writeFile(filepath, buffer);

      try {
        allure.attachment(name, buffer, 'image/png');
      } catch (e) {
        console.log('Allure attachment failed:', e);
      }

      console.log(`Screenshot captured: ${filename}`);
    }
  }

  async captureErrorScreenshot(name: string): Promise<void> {
    if (this.page) {
      const filename = `ERROR_${name.replace(/\s+/g, '_')}.png`;
      const filepath = path.join(this.screenshotsPath, filename);

      const buffer = await this.page.screenshot({ fullPage: true });
      await fs.promises.writeFile(filepath, buffer);

      try {
        allure.attachment(`ERROR: ${name}`, buffer, 'image/png');
      } catch (e) {
        console.log('Allure attachment failed:', e);
      }

      console.log(`Error screenshot captured: ${filename}`);
    }
  }
}

setWorldConstructor(CustomWorld);

export { CustomWorld };