#  Quick Start - Snapshot Reports

##  Recommended Command (Opens the report automatically)

```bash
npm run test:report:open
```

**What does it do?**
1. ✅ Runs all tests
2. ✅ Captures screenshots automatically
3. ✅ Generates an HTML report with embedded snapshots
4. ✅ Opens it automatically in your browser 🎉

---

## Other Commands

### Run tests and generate report (without opening browser)
```bash
npm run test:report
```

### Run tests only (without generating report)
```bash
npm test
```

### Generate report (without running tests)
```bash
npm run generate:html-report
```

### Generate Allure report (optional)
```bash
npm run generate:allure
```

---

## Generated Files

```
reports/
├── cucumber-report-with-snapshots.html  ← Open this in your browser! 🎉
├── cucumber-report.json                 (raw JSON)
├── cucumber-report.html                 (basic HTML)
└── screenshots/                         (All captured images)
    ├── Login_page_123456789.png
    ├── Shopping_cart_123456790.png
    └── FAILED_Checkout_123456791.png
```

---

##  Capture Screenshots Manually

In any step definition:

```typescript
import { CustomWorld } from '../support/world';
import { When } from '@cucumber/cucumber';

When('example', async function (this: CustomWorld) {
  // Your code...
  
  // Capture a screenshot
  await this.captureScreenshot('Descriptive name here');
});
```

---

##  Report Features

- 🎨 Modern, responsive interface
- 📊 Real-time stats (Passed/Failed/Skipped)
- 🖼️ Screenshot grid with preview
- 🔍 Modal to view screenshots full size
- 📱 Fully responsive (mobile-friendly)
- 🎯 Expand/collapse features
- 📝 Step-by-step scenario details

---

##  Full Documentation

For more details, read:
- [REPORTING.md](REPORTING.md) - Full guide
- [SCREENSHOT_EXAMPLES.md](SCREENSHOT_EXAMPLES.md) - Code examples

---

That’s it! Run `npm run test:report:open` and enjoy your reports 📸✨
