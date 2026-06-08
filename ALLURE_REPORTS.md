#  Allure Reports - Complete Guide

Allure is a modern, graphical reporting framework that provides detailed test visualizations with support for screenshots, videos, timelines, and much more.

---

##  Quick Start

###  Run Tests and Open Allure Report

```bash
npm run test:allure:open
```

This command:
1. ✅ Runs all tests
2. ✅ Captures screenshots automatically
3. ✅ Generates an Allure report with graphical data
4. ✅ Opens it automatically in your browser

---

##  Report Structure

```
reports/
├── allure-report/              # Allure graphical report ⭐
├── allure-results/             # JSON data for Allure
├── cucumber-report.json        # Cucumber data
├── cucumber-report.html        # Simple HTML report
└── screenshots/                # Captured screenshots
```

---

##  Allure Features

### 1. **Main Dashboard**
-  Pie charts with statistics
-  Test durations
-  Execution history
-  Success rate

### 2. **Scenario Details**
-  Executed steps with timeline
-  Embedded screenshots
-  Error stack traces
-  Tags and categories

### 3. **Visualizations**
-  Execution timeline
-  Status distribution
-  Duration charts
-  Test categories

---

##  Use Snapshots with Allure

### Automatic capture on failures

Screenshots are automatically captured in your failing tests:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Then('I verify the result', async function (this: CustomWorld) {
  // If this fails, the screenshot is captured automatically
  const text = await this.page.textContent('.result');
  expect(text).to.equal('Success');
});
```

### Manual Capture

Capture screenshots at specific points:

```typescript
When('the user completes the form', async function (this: CustomWorld) {
  await this.page.fill('[name="email"]', 'user@example.com');
  await this.page.fill('[name="password"]', 'pass123');
  
  // Capture screenshot - it will appear in Allure
  await this.captureScreenshot('Form completed');
  
  await this.page.click('button[type="submit"]');
});
```

### Manual Error Capture

```typescript
Then('I verify critical data', async function (this: CustomWorld) {
  try {
    const balance = await this.page.textContent('.balance');
    expect(balance).to.include('$1000');
  } catch (error) {
    // Capture error for evidence
    await this.captureErrorScreenshot('Balance verification failed');
    throw error;
  }
});
```

---

##  Screenshots in Allure

When you run `npm run test:allure:open`, screenshots appear:

### On failures
- A screenshot is captured automatically at the moment of failure
- It is attached as visual evidence to the report

### In manual steps
- Any `captureScreenshot()` appears in Allure
- It shows under the step that captured it

### Viewing
- Click any screenshot to enlarge
- View in full zoom
- Compare multiple screenshots

---

##  Available Scripts

```bash
#  RECOMMENDED: Run tests and open Allure automatically
npm run test:allure:open

# Run tests and generate Allure report (without opening)
npm run test:allure

# Open an existing Allure report
npm run open:allure

# Generate Allure report (without running tests)
npm run generate:allure

# Run tests only (without generating report)
npm test

# Generate simple HTML report (without Allure)
npm run test:report:open
```

---

##  Structure of an Allure Report

### Header
- Title and total time
- Navigation buttons
- Report version

### Sidebar
- **Suites**: Organization of features
- **Tests**: Full list of scenarios
- **Graphs**: Visualizations
- **Timeline**: Execution order
- **Categories**: Failure categorization

### Content
- Test status (✅ Passed, ❌ Failed, ⏭️ Skipped)
- Steps with individual duration
- Attached screenshots
- Execution history

---

##  Best Practices with Allure

### 1. Strategic Capture
```typescript
// ✅ GOOD: Capture at key points
When('the user authenticates', async function (this: CustomWorld) {
  await this.page.fill('[name="username"]', 'testuser');
  await this.page.fill('[name="password"]', 'password');
  await this.captureScreenshot('Login form filled');  // Before submitting
  
  await this.page.click('button[type="submit"]');
  await this.page.waitForNavigation();
  await this.captureScreenshot('Logged in successfully');  // After
});
```

### 2. Descriptive Names
```typescript
// ✅ GOOD
await this.captureScreenshot('Shopping cart with 3 items');

// ❌ AVOID
await this.captureScreenshot('Screenshot 1');
```

### 3. Captured Failures
```typescript
// Error screenshots are captured automatically
Then('I verify the total', async function (this: CustomWorld) {
  const total = await this.page.textContent('.total-price');
  // If this fails, Allure captures the screenshot automatically
  expect(total).to.include('$99.99');
});
```

---

##  Continuous Integration

### GitHub Actions
```yaml
- name: Run Tests with Allure Report
  run: npm run test:allure:open

- name: Upload Allure Report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: allure-report
    path: reports/allure-report/
```

---

##  Advanced Features

### Filtering
- Filter by status (Passed, Failed, Skipped)
- Filter by duration
- Filter by feature/tag

### Search
- Search by test name
- Search by error message
- Global search

### History
- View previous runs
- Compare results
- Trend analysis

### Export
- Download reports
- Share via URL
- Integrate with ReportPortal

---

##  Troubleshooting

### Screenshots do not appear in Allure

1. Verify `captureScreenshot()` is being called
2. Check the `reports/screenshots/` folder
3. Regenerate the report: `npm run test:allure:open`

### Allure does not generate

1. Install dependencies: `npm install`
2. Clean reports: `rm -rf reports/allure-results`
3. Run: `npm run test:allure:open`

### Error opening report

1. Verify Node.js 14+ is installed
2. Install Allure: `npm install --save-dev allure-commandline`
3. Use: `npm run open:allure`

---

##  Resources

- [Allure documentation](https://docs.qameta.io/allure/)
- [Allure on GitHub](https://github.com/allure-framework)
- [Cucumber Allure Adapter](https://github.com/allure-framework/allure-js)

---

##  Complete Example

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { expect } from 'chai';

// Feature: Shopping Cart
// Scenario: Add multiple products to cart

Given('the user is on the shop page', async function (this: CustomWorld) {
  await this.page.goto('https://shop.example.com');
  await this.captureScreenshot('Shop loaded');
});

When('the user adds {int} products to the cart', async function (this: CustomWorld, quantity: number) {
  for (let i = 0; i < quantity; i++) {
    await this.page.click('.add-to-cart');
    await this.captureScreenshot(`Product ${i + 1} added`);
  }
});

Then('the cart shows {int} products', async function (this: CustomWorld, expected: number) {
  await this.captureScreenshot('Cart before verification');
  
  const count = await this.page.locator('.cart-item').count();
  expect(count).to.equal(expected);
  
  await this.captureScreenshot('Verification completed');
});
```

**Result in Allure:**
- ✅ Scenario: Add multiple products to cart
- 📸 Screenshot: Shop loaded
- 📸 Screenshot: Product 1 added
- 📸 Screenshot: Product 2 added
- 📸 Screenshot: Cart before verification
- ✅ Step: the cart shows 2 products
- 📸 Screenshot: Verification completed

---

Enjoy your graphical Allure reports! 🎉✨
