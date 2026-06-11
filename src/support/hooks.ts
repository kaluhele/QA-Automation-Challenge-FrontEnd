import { Before, After, Status } from '@cucumber/cucumber';
import playwright from 'playwright';
import { CustomWorld } from './world.ts';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const ALLURE_RESULTS_DIR = './reports/allure-results';

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeAllureResult(result: object) {
  ensureDir(ALLURE_RESULTS_DIR);
  const uuid = crypto.randomUUID();
  const filePath = path.join(ALLURE_RESULTS_DIR, `${uuid}-result.json`);
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
}

function writeAllureAttachment(name: string, buffer: Buffer, contentType: string): string {
  ensureDir(ALLURE_RESULTS_DIR);
  const uuid = crypto.randomUUID();
  const ext = contentType === 'image/png' ? 'png' : 'txt';
  const fileName = `${uuid}-attachment.${ext}`;
  const filePath = path.join(ALLURE_RESULTS_DIR, fileName);
  fs.writeFileSync(filePath, buffer);
  return fileName;
}

Before({ tags: '@skip' }, async function () {
  return 'skipped';
});

Before(async function (this: CustomWorld, { pickle }) {
  this.browser = await playwright.chromium.launch({ headless: true });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.testStartTime = Date.now();
  this.pickle = pickle;
});

After(async function (this: CustomWorld, { result, pickle }) {
  const stop = Date.now();
  const start = this.testStartTime || stop;
  const status = result?.status === Status.PASSED ? 'passed'
    : result?.status === Status.FAILED ? 'failed'
    : 'skipped';

  const attachments: object[] = [];

  if (this.page) {
    const scenarioName = pickle.name.replace(/\s+/g, '_');
    const screenshot = await this.page.screenshot({ fullPage: true });
    const attachmentName = status === 'failed'
      ? `❌ ERROR_${scenarioName}`
      : `✅ ${scenarioName}`;

    const fileName = writeAllureAttachment(attachmentName, screenshot, 'image/png');
    attachments.push({
      name: attachmentName,
      source: fileName,
      type: 'image/png'
    });

    await this.captureScreenshot(scenarioName);
  }

  writeAllureResult({
    uuid: crypto.randomUUID(),
    historyId: crypto.createHash('md5').update(pickle.name).digest('hex'),
    name: pickle.name,
    status,
    start,
    stop,
    attachments,
    labels: [
      { name: 'feature', value: pickle.uri.split('/').pop()?.replace('.feature', '') || '' },
      { name: 'story', value: pickle.name }
    ],
    steps: []
  });

  if (this.context) await this.context.close();
  if (this.browser) await this.browser.close();
});