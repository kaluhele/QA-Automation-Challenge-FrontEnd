# Reporting Guide with Snapshots

This document explains how to use the enhanced reporting system with snapshots for your Cucumber + Playwright test suite.

## Features

- ✅ **Interactive HTML report** with embedded screenshots
- ✅ **Automatic screenshot capture** on failures
- ✅ **Manual screenshot capture** at any time
- ✅ **Detailed test run statistics**
- ✅ **Friendly UI** with dark mode and image enlarge modal
- ✅ **Organization by features and scenarios**

## Quick Start

### Recommended Option: Run tests and open report automatically

```bash
npm run test:report:open
```

This command runs the tests, generates the report, and opens it automatically in your default browser.

### Other Options

#### 1. Run tests and generate report (without opening browser)

```bash
npm run test:report
```

#### 2. Generate HTML report (without running tests)

If you already ran the tests and want to regenerate the report:

```bash
npm run generate:html-report
```

#### 3. View the report

Open the generated file in your browser:
```
reports/cucumber-report-with-snapshots.html
```

## Automatic Screenshot Capture

Screenshots are automatically captured in the following cases:

### On failures
When a scenario fails, a screenshot is automatically captured of the page state at that moment. The file name will follow the pattern:
```
FAILED_{ScenarioName}_{timestamp}.png
```

### Manual in your steps

In any of your step definitions, you can capture a screenshot manually:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

When('the user clicks the button', async function (this: CustomWorld) {
  await this.page.click('button.submit');
  
  // Capture screenshot after the action
  await this.captureScreenshot('After clicking submit');
});

Then('I verify the result', async function (this: CustomWorld) {
  // Capture screenshot before verification
  await this.captureScreenshot('Page state before verification');
  
  const heading = await this.page.textContent('h1');
  expect(heading).to.equal('Success');
});
```

### Methods available in CustomWorld

#### `captureScreenshot(name: string)`
Captures a screenshot with a descriptive name.
- `name`: Descriptive screenshot name (spaces will be replaced with underscores)

**Example:**
```typescript
await this.captureScreenshot('Login form completed');
// Generates: Login_form_completed_{timestamp}.png
```

#### `captureErrorScreenshot(stepName: string)`
Captures an error screenshot automatically (used internally by hooks).

## Report File Structure

```
reports/
├── cucumber-report.json              # Cucumber JSON report
├── cucumber-report.html              # Basic HTML report
├── cucumber-report-with-snapshots.html  # Interactive report with snapshots ⭐
└── screenshots/                      # Screenshot directory
    ├── Login_form_1234567890.png
    ├── Shopping_cart_1234567891.png
    └── FAILED_Checkout_1234567892.png
```

## HTML Report Features

### Interactive Interface
- **Header**: Title and description
- **Statistics Panel**: Summary of passed, failed, skipped, and total
- **Expandable Features**: Click each feature to expand/collapse
- **Scenario Navigation**: View each scenario with its status
- **Screenshot View**: Screenshot grid with preview

### Expand Modal
- Click any screenshot to view it at full size
- Close the modal by clicking the X or outside the image

### Color Codes
- 🟢 **Green**: Passed scenarios/steps
- 🔴 **Red**: Failed scenarios/steps
- 🟡 **Yellow**: Skipped scenarios/steps

## Configuration

### playwright.config.ts
The following options are configured for automatic capture:

```typescript
use: {
  headless: true,                    // Headless browser
  screenshot: 'only-on-failure',     // Capture only on failures
  video: 'retain-on-failure',        // Videos on failures
  trace: 'on-first-retry'            // Playwright trace
}
```

### cucumber.js
Formatters configuration:

```javascript
format: [
  'progress',                              // Console
  'json:reports/cucumber-report.json',    // JSON
  'html:reports/cucumber-report.html',    // Basic HTML
  '@cucumber/pretty-formatter'            // Pretty formatting
]
```

## Best Practices

### 1. Strategic Capture
```typescript
// ✅ GOOD: Capture at critical points
When('the user fills out the form', async function (this: CustomWorld) {
  await this.page.fill('[name="email"]', 'test@example.com');
  await this.page.fill('[name="password"]', 'password123');
  await this.captureScreenshot('Completed form');
  await this.page.click('button[type="submit"]');
});
```

### 2. Descriptive Names
```typescript
// ✅ GOOD: Clear descriptive name
await this.captureScreenshot('Cart with 3 items');

// ❌ AVOID: Generic names
await this.captureScreenshot('Screenshot 1');
```

### 3. Full Flow
```typescript
Then('I verify the purchase', async function (this: CustomWorld) {
  await this.captureScreenshot('Confirmation page before verification');
  
  const message = await this.page.textContent('.confirmation-message');
  expect(message).to.include('Thank you for your purchase!');
  
  await this.captureScreenshot('Confirmation page after verification');
});
```

## Troubleshooting

### Screenshots do not appear in the report
1. Verify the tests ran successfully: `npm test`
2. Check the `reports/screenshots/` folder for files
3. Regenerate the report: `npm run generate:html-report`

### HTML report does not generate
1. Make sure `reports/cucumber-report.json` exists
2. Run the tests first: `npm test`
3. Try regenerating manually: `npm run generate:html-report`

### Black or blurry screenshots
1. Increase wait time before capture:
   ```typescript
   await this.page.waitForSelector('.important-element');
   await this.captureScreenshot('Visible element');
   ```
2. Use `fullPage: true` (already configured by default)

## Available Scripts

```bash
# RECOMMENDED: Run tests and open the report automatically
npm run test:report:open

# Run tests and generate report
npm run test:report

# Generate only the HTML report (without running tests)
npm run generate:html-report

# Run tests
npm test

# Generate Allure report (optional, if configured)
npm run generate:allure
```

## Continuous Integration

Use this in your CI/CD pipeline:

```yaml
# Example with GitHub Actions
- name: Run tests and generate report
  run: npm run test:report

- name: Upload report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: test-report
    path: reports/
```

## Important Notes

- Screenshots are saved as **full-page PNG** files (fullPage)
- Filenames are generated with a **timestamp** to avoid overwriting
- The HTML report is **self-contained** and does not require external dependencies
- You can **share the HTML file** as a report with your team
- Screenshots are stored in **reports/screenshots/** by default

---

Enjoy your detailed snapshot-enabled reports! 📸✨
