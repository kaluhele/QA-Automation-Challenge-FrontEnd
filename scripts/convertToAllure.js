#!/usr/bin/env node

/**
 * Convertidor de resultados Cucumber JSON a formato Allure
 * Genera resultados JSON en el directorio de Allure con screenshots
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CUCUMBER_REPORT = './reports/cucumber-report.json';
const ALLURE_RESULTS_DIR = './reports/allure-results';
const SCREENSHOTS_DIR = './reports/screenshots';

// Crear directorio si no existe
if (!fs.existsSync(ALLURE_RESULTS_DIR)) {
  fs.mkdirSync(ALLURE_RESULTS_DIR, { recursive: true });
}

try {
  // Leer reporte de Cucumber
  if (!fs.existsSync(CUCUMBER_REPORT)) {
    console.error('❌ No se encontró el reporte JSON de Cucumber');
    process.exit(1);
  }

  // Obtener lista de screenshots
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

  // Convertir cada scenario a un resultado de Allure
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
        attachments: addScreenshotAttachments(screenshots),
        shouldDisplayMessage: false,
        hasContent: true
      };

      // Guardar resultado de Allure
      const filename = `${allureResult.uuid}-result.json`;
      fs.writeFileSync(path.join(ALLURE_RESULTS_DIR, filename), JSON.stringify(allureResult, null, 2));
    });
  });

  // Copiar screenshots al directorio de Allure
  if (fs.existsSync(SCREENSHOTS_DIR)) {
    screenshots.forEach(screenshot => {
      const src = path.join(SCREENSHOTS_DIR, screenshot);
      const dest = path.join(ALLURE_RESULTS_DIR, screenshot);
      try {
        fs.copyFileSync(src, dest);
      } catch (err) {
        console.warn(`⚠️ No se pudo copiar screenshot: ${screenshot}`);
      }
    });
  }

  // Crear archivo de categorías para Allure
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

  console.log('✅ Resultados convertidos a formato Allure');
  console.log(`📊 Total de scenarios: ${resultIndex - 1}`);
  console.log(`📸 Screenshots incluidos: ${screenshots.length}`);

} catch (error) {
  console.error('❌ Error al convertir resultados:', error.message);
  process.exit(1);
}

/**
 * Obtiene el estado del scenario
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
 * Calcula la duración total del scenario
 */
function calculateDuration(scenario) {
  if (!scenario.steps) return 0;
  
  return scenario.steps.reduce((total, step) => {
    return total + (step.result.duration || 0);
  }, 0);
}

/**
 * Agrega screenshots como adjuntos
 */
function addScreenshotAttachments(screenshots) {
  return screenshots.map(screenshot => ({
    name: screenshot,
    source: screenshot,
    type: 'image/png'
  }));
}
