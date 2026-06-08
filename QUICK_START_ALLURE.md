#  Quick Start - Allure Reports + Snapshots

##  One Command for Everything

```bash
npm run test:allure:open
```

This runs:
1. ✅ Tests
2. ✅ Screenshot capture
3. ✅ Generates a professional, graphical **Allure** report
4. ✅ Opens it in your browser

---

## What You Will See in Allure

- 📊 Nice graphical dashboard
- 📈 Test stats (Passed/Failed/Skipped)
- ⏱️ Test duration details
- 🖼️ Embedded screenshots in each step
- 📝 Execution timeline
- 🎭 Failure categorization

---

## Use Snapshots in Your Tests

In any `step definition`:

```typescript
import { CustomWorld } from '../support/world';
import { When } from '@cucumber/cucumber';

When('something happens', async function (this: CustomWorld) {
  // Your code...
  
  // Capture screenshot - it will appear in Allure
  await this.captureScreenshot('My descriptive snapshot');
});
```

**The screenshot will appear automatically in the Allure report** 📸

---

## Other Commands

```bash
# Run tests and generate report (without opening browser)
npm run test:allure

# Open an existing Allure report
npm run open:allure

# Run tests only
npm test
```

---

## Where Files Are Saved

```
reports/
├── allure-report/          ← The graphical report is here
└── screenshots/            ← Your captured screenshots
```

---

## Full Documentation

Read [ALLURE_REPORTS.md](ALLURE_REPORTS.md) for:
- Advanced configuration
- Best practices
- Code examples
- Troubleshooting

---

**Run `npm run test:allure:open` and enjoy the graphical report!** 🎉✨
