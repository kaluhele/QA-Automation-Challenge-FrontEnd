#!/usr/bin/env node

/**
 * Script to run tests, generate the report, and open it automatically
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import open from 'open';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTestsAndOpenReport() {
  try {
    console.log('\n🧪 Running tests...\n');
    
    // Run tests
    execSync('npm test', { stdio: 'inherit', cwd: process.cwd() });
    
    console.log('\n📊 Generating HTML report...\n');
    
    // Generate HTML report
    execSync('node scripts/generateHtmlReport.js', { stdio: 'inherit', cwd: process.cwd() });
    
    // Report path
    const reportPath = path.join(process.cwd(), 'reports', 'cucumber-report-with-snapshots.html');
    
    // Verify the report exists
    if (fs.existsSync(reportPath)) {
      console.log(`\n✅ Report generated: ${reportPath}`);
      console.log('\n🌐 Opening report in browser...\n');
      
      // Open in browser with file:// URL
      const fileUrl = `file://${path.resolve(reportPath).replace(/\\/g, '/')}`;
      await open(fileUrl);
      
      console.log('✨ Report opened successfully!');
    } else {
      console.error('❌ Error: Report could not be generated');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error during execution:', error.message);
    process.exit(1);
  }
}

runTestsAndOpenReport();
