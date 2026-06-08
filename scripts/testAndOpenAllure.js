#!/usr/bin/env node

/**
 * Script para ejecutar pruebas, generar reporte Allure y abrirlo automáticamente
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
    
    // Crear directorio de resultados de Allure si no existe
    if (!fs.existsSync(allureResultsDir)) {
      fs.mkdirSync(allureResultsDir, { recursive: true });
    }

    console.log('\n🧪 Ejecutando pruebas...\n');
    
    try {
      // Ejecutar pruebas
      execSync('npm test', { stdio: 'inherit', cwd: process.cwd() });
    } catch (error) {
      console.log('\n⚠️ Algunas pruebas fallaron, pero continuaremos generando el reporte...\n');
    }
    
    console.log('\n📊 Generando reporte Allure...\n');
    
    // Convertir resultados de Cucumber a formato Allure
    execSync('node scripts/convertToAllure.js', { stdio: 'inherit', cwd: process.cwd() });
    
    // Generar reporte Allure
    execSync('npm run generate:allure', { stdio: 'inherit', cwd: process.cwd() });
    
    // Abrir Allure con el servidor integrado
    console.log('\n🌐 Abriendo reporte Allure en navegador...\n');
    
    try {
      execSync('allure open ./reports/allure-report', { stdio: 'inherit', cwd: process.cwd() });
    } catch (error) {
      console.error('❌ Error al abrir Allure:', error.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error durante la ejecución:', error.message);
    process.exit(1);
  }
}

runTestsAndOpenAllure();
