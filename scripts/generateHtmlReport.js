import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * HTML Report Generator with Snapshots for Cucumber
 * Integrates screenshots captured during test execution into the report
 */

const REPORTS_DIR = './reports';
const SCREENSHOTS_DIR = './reports/screenshots';
const CUCUMBER_REPORT = './reports/cucumber-report.json';
const OUTPUT_FILE = './reports/cucumber-report-with-snapshots.html';

// Create directory if it does not exist
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Read the JSON report
if (!fs.existsSync(CUCUMBER_REPORT)) {
  console.error('JSON report not found. Run npm test first.');
  process.exit(1);
}

const cucumberReport = JSON.parse(fs.readFileSync(CUCUMBER_REPORT, 'utf8'));
const screenshots = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.endsWith('.png')) || [];

console.log(`Processing report with ${screenshots.length} screenshots...`);

/**
 * Generates HTML report with snapshots
 */
function generateHtmlReport() {
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Automated Test Report - Cucumber + Playwright</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
            border-bottom: 2px solid #e9ecef;
        }
        
        .stat {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        
        .stat-label {
            color: #666;
            font-weight: 500;
        }
        
        .stat.passed {
            border-left-color: #28a745;
        }
        
        .stat.passed .stat-number {
            color: #28a745;
        }
        
        .stat.failed {
            border-left-color: #dc3545;
        }
        
        .stat.failed .stat-number {
            color: #dc3545;
        }
        
        .stat.skipped {
            border-left-color: #ffc107;
        }
        
        .stat.skipped .stat-number {
            color: #ffc107;
        }
        
        .content {
            padding: 30px;
        }
        
        .feature {
            margin-bottom: 40px;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .feature-header {
            background: #f8f9fa;
            padding: 20px;
            border-bottom: 2px solid #dee2e6;
            cursor: pointer;
            user-select: none;
        }
        
        .feature-header:hover {
            background: #e9ecef;
        }
        
        .feature-header h2 {
            color: #333;
            font-size: 1.5em;
            margin-bottom: 5px;
        }
        
        .feature-header p {
            color: #666;
            font-size: 0.95em;
        }
        
        .feature-body {
            padding: 20px;
            display: none;
        }
        
        .feature-body.show {
            display: block;
        }
        
        .scenario {
            margin-bottom: 20px;
            padding: 15px;
            background: #fafbfc;
            border-radius: 6px;
            border-left: 4px solid #667eea;
        }
        
        .scenario.passed {
            border-left-color: #28a745;
        }
        
        .scenario.failed {
            border-left-color: #dc3545;
        }
        
        .scenario.skipped {
            border-left-color: #ffc107;
        }
        
        .scenario-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-badge.passed {
            background: #d4edda;
            color: #155724;
        }
        
        .status-badge.failed {
            background: #f8d7da;
            color: #721c24;
        }
        
        .status-badge.skipped {
            background: #fff3cd;
            color: #856404;
        }
        
        .step {
            margin-bottom: 10px;
            padding: 10px;
            background: white;
            border-radius: 4px;
            border-left: 3px solid #dee2e6;
            font-size: 0.95em;
        }
        
        .step.passed {
            border-left-color: #28a745;
            color: #155724;
        }
        
        .step.failed {
            border-left-color: #dc3545;
            color: #721c24;
        }
        
        .step.skipped {
            border-left-color: #ffc107;
            color: #856404;
        }
        
        .error-message {
            margin-top: 10px;
            padding: 10px;
            background: #ffe6e6;
            border: 1px solid #ffcccc;
            border-radius: 4px;
            color: #c33;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            white-space: pre-wrap;
            word-break: break-word;
        }
        
        .screenshots-section {
            margin-top: 20px;
        }
        
        .screenshots-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 2px solid #667eea;
        }
        
        .screenshot-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 10px;
        }
        
        .screenshot-item {
            border: 1px solid #ddd;
            border-radius: 6px;
            overflow: hidden;
            background: #f8f9fa;
        }
        
        .screenshot-label {
            padding: 8px;
            background: #f8f9fa;
            font-size: 0.85em;
            color: #666;
            font-weight: 500;
            word-break: break-word;
        }
        
        .screenshot-img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .screenshot-img:hover {
            transform: scale(1.05);
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
        }
        
        .modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            position: relative;
            background: white;
            padding: 20px;
            border-radius: 10px;
            max-width: 90vw;
            max-height: 90vh;
            overflow: auto;
        }
        
        .modal-img {
            width: 100%;
            height: auto;
        }
        
        .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            color: #aaa;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            background: none;
            border: none;
        }
        
        .close-btn:hover {
            color: #000;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-top: 2px solid #dee2e6;
            color: #666;
            font-size: 0.9em;
        }
        
        .timestamp {
            color: #999;
            font-size: 0.85em;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Automated Test Report</h1>
            <p>Cucumber + Playwright + TypeScript</p>
        </div>
  `;

  // Calculate statistics
  const stats = calculateStats(cucumberReport);
  
  html += `
        <div class="summary">
            <div class="stat passed">
                <div class="stat-number">${stats.passed}</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat failed">
                <div class="stat-number">${stats.failed}</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat skipped">
                <div class="stat-number">${stats.skipped}</div>
                <div class="stat-label">Skipped</div>
            </div>
            <div class="stat">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Total</div>
            </div>
        </div>
  `;

  html += '<div class="content">';

  // Process features
  cucumberReport.forEach((feature, featureIndex) => {
    const featureStats = calculateFeatureStats(feature);
    const status = featureStats.failed > 0 ? 'failed' : featureStats.passed > 0 ? 'passed' : 'skipped';
    
    html += `
            <div class="feature">
                <div class="feature-header" onclick="toggleFeature(${featureIndex})">
                    <h2>${feature.name}</h2>
                    <p>${feature.description || ''}</p>
                </div>
                <div class="feature-body" id="feature-${featureIndex}">
    `;

    // Process scenarios
    if (feature.elements) {
      feature.elements.forEach((scenario, scenarioIndex) => {
        const scenarioStatus = getScenarioStatus(scenario);
        
        html += `
                    <div class="scenario ${scenarioStatus}">
                        <div class="scenario-title">
                            <span class="status-badge ${scenarioStatus}">${scenarioStatus}</span>
                            <span>${scenario.name}</span>
                        </div>
        `;

        // Process steps
        if (scenario.steps) {
          scenario.steps.forEach((step) => {
            const stepStatus = step.result.status;
            html += `<div class="step ${stepStatus}">${step.keyword.trim()} ${step.name}</div>`;
            
            if (step.result.error_message) {
              html += `<div class="error-message">${escapeHtml(step.result.error_message)}</div>`;
            }
          });
        }

        // Add screenshots if they exist
        if (screenshots.length > 0) {
          html += `
                        <div class="screenshots-section">
                            <div class="screenshots-title">📸 Screenshots</div>
                            <div class="screenshot-grid">
          `;
          
          screenshots.forEach((screenshot) => {
            const relativePath = `screenshots/${screenshot}`;
            html += `
                                <div class="screenshot-item">
                                    <div class="screenshot-label">${screenshot}</div>
                                    <img src="${relativePath}" alt="Screenshot" class="screenshot-img" onclick="openModal('${relativePath}')">
                                </div>
            `;
          });

          html += `
                            </div>
                        </div>
          `;
        }

        html += '</div>';
      });
    }

    html += `
                </div>
            </div>
    `;
  });

  html += '</div>';

  html += `
        <div class="footer">
            <p>Report generated automatically by Cucumber + Playwright</p>
            <div class="timestamp">Generated: ${new Date().toLocaleString('en-US')}</div>
        </div>
    </div>

    <!-- Modal to view screenshots in full size -->
    <div id="imageModal" class="modal">
        <div class="modal-content">
            <button class="close-btn" onclick="closeModal()">&times;</button>
            <img id="modalImage" class="modal-img" alt="Screenshot">
        </div>
    </div>

    <script>
        function toggleFeature(index) {
            const featureBody = document.getElementById('feature-' + index);
            featureBody.classList.toggle('show');
        }

        function openModal(imagePath) {
            const modal = document.getElementById('imageModal');
            const modalImage = document.getElementById('modalImage');
            modalImage.src = imagePath;
            modal.classList.add('show');
        }

        function closeModal() {
            const modal = document.getElementById('imageModal');
            modal.classList.remove('show');
        }

        // Close modal when clicking outside the image
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('imageModal');
            if (event.target === modal) {
                closeModal();
            }
        });

        // Expand all features by default
        document.querySelectorAll('.feature-body').forEach(body => {
            body.classList.add('show');
        });
    </script>
</body>
</html>
  `;

  return html;
}

/**
 * Calculate report statistics
 */
function calculateStats(report) {
  let passed = 0, failed = 0, skipped = 0, total = 0;

  report.forEach(feature => {
    if (feature.elements) {
      feature.elements.forEach(scenario => {
        total++;
        const status = getScenarioStatus(scenario);
        if (status === 'passed') passed++;
        else if (status === 'failed') failed++;
        else if (status === 'skipped') skipped++;
      });
    }
  });

  return { passed, failed, skipped, total };
}

/**
 * Calculate statistics for a feature
 */
function calculateFeatureStats(feature) {
  let passed = 0, failed = 0;

  if (feature.elements) {
    feature.elements.forEach(scenario => {
      const status = getScenarioStatus(scenario);
      if (status === 'passed') passed++;
      else if (status === 'failed') failed++;
    });
  }

  return { passed, failed };
}

/**
 * Get the status of a scenario
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
 * Escape HTML characters
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Generate the HTML file
const htmlContent = generateHtmlReport();
fs.writeFileSync(OUTPUT_FILE, htmlContent);

console.log(`\n✅ Report generated successfully: ${OUTPUT_FILE}`);
console.log(`📊 Total screenshots: ${screenshots.length}`);
console.log(`\nYou can open the report in your browser.`);
