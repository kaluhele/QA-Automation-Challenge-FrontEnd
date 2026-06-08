import { setWorldConstructor, IWorldOptions, World } from '@cucumber/cucumber';
import { Browser, Page } from 'playwright';
import path from 'path';
import fs from 'fs';

let allure: any = {
  addAttachment: () => {}
};

class CustomWorld extends World {
  browser!: Browser;
  page!: Page;
  screenshotsPath: string = 'reports/screenshots';

  constructor(options: IWorldOptions) {
    super(options);
    // Create screenshots directory if it does not exist
    if (!fs.existsSync(this.screenshotsPath)) {
      fs.mkdirSync(this.screenshotsPath, { recursive: true });
    }
  }

  /**
   * Capture a screenshot and attach it to the report
   */
  async captureScreenshot(name: string): Promise<void> {
    if (this.page) {
      const timestamp = new Date().getTime();
      const filename = `${name.replace(/\s+/g, '_')}_${timestamp}.png`;
      const filepath = path.join(this.screenshotsPath, filename);
      
      const buffer = await this.page.screenshot({ fullPage: true });
      await fs.promises.writeFile(filepath, buffer);
      
      // Add screenshot to Allure
      try {
        allure.addAttachment(name, buffer, 'image/png');
      } catch (e) {
        // Allure is not available, continue
      }
      
      console.log(`Screenshot captured: ${filename}`);
    }
  }

  /**
   * Capture a screenshot on error
   */
  async captureErrorScreenshot(stepName: string): Promise<void> {
    if (this.page) {
      const timestamp = new Date().getTime();
      const filename = `ERROR_${stepName.replace(/\s+/g, '_')}_${timestamp}.png`;
      const filepath = path.join(this.screenshotsPath, filename);
      
      const buffer = await this.page.screenshot({ fullPage: true });
      await fs.promises.writeFile(filepath, buffer);
      
      // Add screenshot to Allure as failure evidence
      try {
        allure.addAttachment(`ERROR: ${stepName}`, buffer, 'image/png');
      } catch (e) {
        // Allure is not available, continue
      }
      
      console.log(`Error screenshot captured: ${filename}`);
    }
  }
}

setWorldConstructor(CustomWorld);

export { CustomWorld };
