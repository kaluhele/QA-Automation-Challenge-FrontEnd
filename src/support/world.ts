import { setWorldConstructor } from '@cucumber/cucumber';
import { Browser, Page } from 'playwright';

class CustomWorld {
  browser!: Browser;
  page!: Page;
}

setWorldConstructor(CustomWorld);

export { CustomWorld };
