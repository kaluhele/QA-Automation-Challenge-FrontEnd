#!/usr/bin/env node

/**
 * Script to run tests, generate Allure report, and open it automatically
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import open from 'open';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTestsAndOpenAllure() {
  try {
    const reportsDir = path.join(process.cwd(), 'reports');
    const allureResultsDir = path.join(reportsDir, 'allure-results');
    
    // Create Allure results directory if it does not exist
    if (!fs.existsSync(allureResultsDir)) {
      fs.mkdirSync(allureResultsDir, { recursive: true });
    }

    console.log('\n🧪 Running tests...\n');
    
    try {
      // Run tests
      execSync('npm test', { stdio: 'inherit', cwd: process.cwd() });
    } catch (error) {
      console.log('\n⚠️ Some tests failed, but we will continue generating the report...\n');
    }
    
    console.log('\n📊 Generating Allure report...\n');
    
    // Convert Cucumber results to Allure format
    execSync('node scripts/convertToAllure.js', { stdio: 'inherit', cwd: process.cwd() });
    
    // Generate Allure report
    execSync('npm run generate:allure', { stdio: 'inherit', cwd: process.cwd() });
    
    // Open Allure with the integrated server
    console.log('\n🌐 Opening Allure report in browser...\n');
    
    try {
      execSync('allure open ./reports/allure-report', { stdio: 'inherit', cwd: process.cwd() });
    } catch (error) {
      console.error('❌ Error opening Allure:', error.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error during execution:', error.message);
    process.exit(1);
  }
}

runTestsAndOpenAllure();
