# QA Automation Challenge - FrontEnd

Automated UI testing framework built with Playwright, Cucumber (BDD), and TypeScript, following the Page Object Model (POM) design pattern.

---

## Tech Stack

- **Language:** TypeScript  
- **Automation Framework:** Playwright  
- **BDD Framework:** Cucumber  
- **Assertion Library:** Chai  
- **Utilities:** dotenv, faker  

---

## Prerequisites

Before running the project, ensure you have:

| Tool                | Version   |
| ------------------- | --------- |
| Node.js             | 18+       |
| npm                 | Latest    |
| Playwright Browsers | Installed |

Verify installation:

```bash
node -v
npm -v
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/kaluhele/QA-Automation-Challenge-FrontEnd.git
cd QA-Automation-Challenge-FrontEnd
```

### Install Dependencies

```bash
npm install
```

### Install Playwright Browsers

```bash
npx playwright install
```

---

## Project Structure

```text
QA-Automation-Challenge-FrontEnd
│
├── src
│   ├── features        # Gherkin feature files
│   ├── steps           # Step definitions
│   ├── pages           # Page Objects
│   └── support         # Hooks, world, utils
│
├── cucumber.js             
├── package.json         
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

---

## Running Tests

```bash
npm test
npm run test:allure:open
```
---

## Author

**Kaluhele**

Senior QA Engineer

---

## Acknowledgements

- Playwright
- Cucumber
- Gherkin
- TypeScript
- Open Source Community

---

## Automation Strategy & Design Patterns

### Automation Strategy
The automation framework is designed to validate critical user flows of the application through **UI testing**. The strategy focuses on:

- **Behavior-Driven Development (BDD):** Using Cucumber with Gherkin syntax to describe scenarios in a business-readable format. This ensures collaboration between QA, developers, and stakeholders.
- **Cross-browser validation:** Leveraging Playwright’s capabilities to run tests across Chromium, Firefox, and WebKit.
- **Scalability:** Modular test design allows easy addition of new features and scenarios without impacting existing tests.
- **Maintainability:** Clear separation of concerns between feature files, step definitions, and page objects.
- **Reporting & Monitoring:** Automated generation of HTML and Allure reports to provide visibility into test execution and results.

### Design Patterns Used
- **Page Object Model (POM):** Encapsulates UI elements and actions in dedicated classes, reducing duplication and improving readability.
- **Reusable Step Definitions:** Common steps are abstracted to avoid redundancy and promote consistency across scenarios.
- **Hooks Management:** `Before` and `After` hooks handle browser lifecycle (launch/close) and environment setup, ensuring clean test execution.
- **Environment Configuration:** Use of `dotenv` for managing environment variables (URLs, credentials, etc.) to support multiple environments.
- **Data-driven Testing:** Integration of `faker` for dynamic test data generation, improving robustness and reducing reliance on static inputs.

### Benefits
- **Collaboration:** BDD scenarios bridge communication between technical and non-technical stakeholders.  
- **Efficiency:** POM and reusable steps reduce maintenance effort.  
- **Reliability:** Hooks and environment management ensure stable test runs.  
- **Visibility:** Reporting tools provide clear insights into test coverage and results.  
