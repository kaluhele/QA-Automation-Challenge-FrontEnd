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
    // Crear directorio de screenshots si no existe
    if (!fs.existsSync(this.screenshotsPath)) {
      fs.mkdirSync(this.screenshotsPath, { recursive: true });
    }
  }

  /**
   * Captura una screenshot y la asocia al reporte
   */
  async captureScreenshot(name: string): Promise<void> {
    if (this.page) {
      const timestamp = new Date().getTime();
      const filename = `${name.replace(/\s+/g, '_')}_${timestamp}.png`;
      const filepath = path.join(this.screenshotsPath, filename);
      
      const buffer = await this.page.screenshot({ fullPage: true });
      await fs.promises.writeFile(filepath, buffer);
      
      // Agregar screenshot a Allure
      try {
        allure.addAttachment(name, buffer, 'image/png');
      } catch (e) {
        // Allure no está disponible, continuar
      }
      
      console.log(`Screenshot capturada: ${filename}`);
    }
  }

  /**
   * Captura screenshot en caso de error
   */
  async captureErrorScreenshot(stepName: string): Promise<void> {
    if (this.page) {
      const timestamp = new Date().getTime();
      const filename = `ERROR_${stepName.replace(/\s+/g, '_')}_${timestamp}.png`;
      const filepath = path.join(this.screenshotsPath, filename);
      
      const buffer = await this.page.screenshot({ fullPage: true });
      await fs.promises.writeFile(filepath, buffer);
      
      // Agregar screenshot a Allure como evidencia de fallo
      try {
        allure.addAttachment(`ERROR: ${stepName}`, buffer, 'image/png');
      } catch (e) {
        // Allure no está disponible, continuar
      }
      
      console.log(`Screenshot de error capturada: ${filename}`);
    }
  }
}

setWorldConstructor(CustomWorld);

export { CustomWorld };
