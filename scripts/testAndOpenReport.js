#!/usr/bin/env node

/**
 * Script para ejecutar pruebas, generar reporte y abrirlo automáticamente
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
    console.log('\n🧪 Ejecutando pruebas...\n');
    
    // Ejecutar pruebas
    execSync('npm test', { stdio: 'inherit', cwd: process.cwd() });
    
    console.log('\n📊 Generando reporte HTML...\n');
    
    // Generar reporte HTML
    execSync('node scripts/generateHtmlReport.js', { stdio: 'inherit', cwd: process.cwd() });
    
    // Ruta del reporte
    const reportPath = path.join(process.cwd(), 'reports', 'cucumber-report-with-snapshots.html');
    
    // Verificar que el reporte existe
    if (fs.existsSync(reportPath)) {
      console.log(`\n✅ Reporte generado: ${reportPath}`);
      console.log('\n🌐 Abriendo reporte en navegador...\n');
      
      // Abrir en navegador con file:// URL
      const fileUrl = `file://${path.resolve(reportPath).replace(/\\/g, '/')}`;
      await open(fileUrl);
      
      console.log('✨ ¡Reporte abierto exitosamente!');
    } else {
      console.error('❌ Error: No se pudo generar el reporte');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error durante la ejecución:', error.message);
    process.exit(1);
  }
}

runTestsAndOpenReport();
