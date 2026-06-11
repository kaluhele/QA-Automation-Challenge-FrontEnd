import { setWorldConstructor, IWorldOptions, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import path from 'path';
import fs from 'fs';

class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  testStartTime!: number;
  pickle!: any;
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
      console.log(`Screenshot captured: ${filename}`);
    }
  }

  async captureErrorScreenshot(name: string): Promise<void> {
    if (this.page) {
      const filename = `ERROR_${name.replace(/\s+/g, '_')}.png`;
      const filepath = path.join(this.screenshotsPath, filename);
      const buffer = await this.page.screenshot({ fullPage: true });
      await fs.promises.writeFile(filepath, buffer);
      console.log(`Error screenshot captured: ${filename}`);
    }
  }
}

setWorldConstructor(CustomWorld);
export { CustomWorld };