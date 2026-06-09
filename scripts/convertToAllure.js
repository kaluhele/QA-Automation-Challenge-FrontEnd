#!/usr/bin/env node

/**
 * Converter for Cucumber JSON results to Allure format
 * Generates JSON results in the Allure directory with screenshots
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CUCUMBER_REPORT = './reports/cucumber-report.json';
const ALLURE_RESULTS_DIR = './reports/allure-results';
const SCREENSHOTS_DIR = './reports/screenshots';

// Create directory if it does not exist
if (!fs.existsSync(ALLURE_RESULTS_DIR)) {
  fs.mkdirSync(ALLURE_RESULTS_DIR, { recursive: true });
}

try {
  // Read Cucumber report
  if (!fs.existsSync(CUCUMBER_REPORT)) {
    console.error('❌ Cucumber JSON report not found');
    process.exit(1);
  }

  // Get list of screenshots
  const screenshots = [];
  if (fs.existsSync(SCREENSHOTS_DIR)) {
    const files = fs.readdirSync(SCREENSHOTS_DIR);
    files.forEach(file => {
      if (file.endsWith('.png')) {
        screenshots.push(file);
      }
    });
  }

  const cucumberData = JSON.parse(fs.readFileSync(CUCUMBER_REPORT, 'utf8'));

  // Convert each scenario into an Allure result
  let resultIndex = 1;

  cucumberData.forEach(feature => {
    if (!feature.elements) return;

    feature.elements.forEach((scenario, scenarioIdx) => {
      const allureResult = {
        uuid: `${Date.now()}-${resultIndex++}`,
        historyId: `${feature.name}-${scenario.name}`,
        name: scenario.name,
        fullName: `${feature.name}: ${scenario.name}`,
        status: getScenarioStatus(scenario),
        stage: 'finished',
        start: Date.now(),
        stop: Date.now(),
        duration: calculateDuration(scenario),
        description: scenario.description || '',
        descriptionHtml: `<div>${scenario.description || ''}</div>`,
        steps: scenario.steps
          .filter(s => s.keyword !== 'Before' && s.keyword !== 'After')
          .map((step, idx) => ({
            name: `${step.keyword.trim()} ${step.name}`,
            status: step.result.status,
            stage: 'finished',
            start: Date.now(),
            stop: Date.now(),
            duration: step.result.duration || 0,
            matchedName: `${step.keyword.trim()} ${step.name}`
          })),
        labels: [
          {
            name: 'feature',
            value: feature.name
          },
          {
            name: 'story',
            value: scenario.name
          },
          {
            name: 'severity',
            value: 'normal'
          },
          {
            name: 'thread'
          },
          {
            name: 'host'
          },
          {
            name: 'language',
            value: 'TypeScript'
          }
        ],
        parameters: [],
        links: [],
        attachments: addScreenshotAttachments(
          screenshots.filter(file => {
            const normalizedFile = file
              .replace(/^ERROR_/, '')
              .replace('.png', '');

            const scenarioName = scenario.name.replace(/\s+/g, '_');

            return normalizedFile === scenarioName;
          })
        ),
        shouldDisplayMessage: false,
        hasContent: true
      };

      // Save Allure result
      const filename = `${allureResult.uuid}-result.json`;
      fs.writeFileSync(path.join(ALLURE_RESULTS_DIR, filename), JSON.stringify(allureResult, null, 2));
    });
  });

  // Copy screenshots to the Allure directory
  if (fs.existsSync(SCREENSHOTS_DIR)) {
    screenshots.forEach(screenshot => {
      const src = path.join(SCREENSHOTS_DIR, screenshot);
      const dest = path.join(ALLURE_RESULTS_DIR, screenshot);
      try {
        fs.copyFileSync(src, dest);
      } catch (err) {
        console.warn(`⚠️ Could not copy screenshot: ${screenshot}`);
      }
    });
  }

  // Create categories file for Allure
  const categories = {
    categories: [
      {
        name: 'Broken',
        matchedStatuses: ['broken']
      },
      {
        name: 'Failed',
        matchedStatuses: ['failed']
      },
      {
        name: 'Passed',
        matchedStatuses: ['passed']
      },
      {
        name: 'Skipped',
        matchedStatuses: ['skipped', 'pending']
      }
    ]
  };

  fs.writeFileSync(
    path.join(ALLURE_RESULTS_DIR, 'categories.json'),
    JSON.stringify(categories, null, 2)
  );

  console.log('✅ Results converted to Allure format');
  console.log(`📊 Total scenarios: ${resultIndex - 1}`);
  console.log(`📸 Screenshots included: ${screenshots.length}`);

} catch (error) {
  console.error('❌ Error converting results:', error.message);
  process.exit(1);
}

/**
 * Get the status of the scenario
 */
function getScenarioStatus(scenario) {
  const visibleSteps = scenario.steps ? scenario.steps.filter(s => !s.hidden) : [];

  if (!visibleSteps.length) {
    return 'skipped';
  }

  const failedSteps = visibleSteps.filter(s => s.result.status === 'failed');
  if (failedSteps.length > 0) {
    return 'failed';
  }

  const skippedSteps = visibleSteps.filter(s => s.result.status === 'skipped' || s.result.status === 'pending');
  if (skippedSteps.length === visibleSteps.length) {
    return 'skipped';
  }

  return 'passed';
}

/**
 * Calculate the total duration of the scenario
 */
function calculateDuration(scenario) {
  if (!scenario.steps) return 0;
  
  return scenario.steps.reduce((total, step) => {
    return total + (step.result.duration || 0);
  }, 0);
}

/**
 * Add screenshots as attachments
 */
function addScreenshotAttachments(screenshots) {
  return screenshots.map(screenshot => ({
    name: screenshot,
    source: screenshot,
    type: 'image/png'
  }));
}
