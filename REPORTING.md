# 📊 Guía de Reportes con Snapshots

Este documento describe cómo usar el sistema de reportes mejorado con snapshots para tu suite de pruebas Cucumber + Playwright.

## 🎯 Características

- ✅ **Reporte HTML interactivo** con screenshots integradas
- ✅ **Captura automática** de screenshots en fallos
- ✅ **Captura manual** de screenshots en cualquier momento
- ✅ **Estadísticas detalladas** del test run
- ✅ **Interfaz amigable** con modo oscuro y modal para ampliar imágenes
- ✅ **Organización por features y scenarios**

## 🚀 Uso Rápido

### ⭐ Opción Recomendada: Ejecutar pruebas y abrir reporte automáticamente

```bash
npm run test:report:open
```

Este comando ejecuta las pruebas, genera el reporte y lo abre automáticamente en tu navegador predeterminado.

### Otras Opciones

#### 1. Ejecutar pruebas y generar reporte (sin abrir navegador)

```bash
npm run test:report
```

#### 2. Generar reporte HTML (sin ejecutar pruebas)

Si ya ejecutaste las pruebas y quieres regenerar el reporte:

```bash
npm run generate:html-report
```

#### 3. Ver el reporte

Abre el archivo generado en tu navegador:
```
reports/cucumber-report-with-snapshots.html
```

## 📸 Captura Automática de Screenshots

Las screenshots se capturan automáticamente en los siguientes casos:

### En fallos
Cuando un scenario falla, se captura automáticamente una screenshot del estado de la página en ese momento. El nombre seguirá el patrón:
```
FAILED_{NombreDelScenario}_{timestamp}.png
```

### Manual en tus steps

En cualquiera de tus step definitions, puedes capturar una screenshot manualmente:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

When('el usuario hace clic en el botón', async function (this: CustomWorld) {
  await this.page.click('button.submit');
  
  // Capturar screenshot después de la acción
  await this.captureScreenshot('Después de hacer clic en submit');
});

Then('verifico el resultado', async function (this: CustomWorld) {
  // Capturar screenshot antes de hacer una verificación
  await this.captureScreenshot('Estado de la página antes de verificación');
  
  const heading = await this.page.textContent('h1');
  expect(heading).to.equal('Éxito');
});
```

### Métodos disponibles en CustomWorld

#### `captureScreenshot(name: string)`
Captura una screenshot con nombre descriptivo.
- `name`: Nombre descriptivo de la screenshot (se reemplazarán espacios por guiones bajos)

**Ejemplo:**
```typescript
await this.captureScreenshot('Formulario de login completado');
// Genera: Formulario_de_login_completado_{timestamp}.png
```

#### `captureErrorScreenshot(stepName: string)`
Captura automáticamente una screenshot de error (usada internamente por hooks).

## 📁 Estructura de Archivos de Reporte

```
reports/
├── cucumber-report.json              # Reporte JSON de Cucumber
├── cucumber-report.html              # Reporte HTML básico
├── cucumber-report-with-snapshots.html  # Reporte interactivo con snapshots ⭐
└── screenshots/                      # Directorio de screenshots
    ├── Formulario_de_login_1234567890.png
    ├── Carrito_de_compras_1234567891.png
    └── FAILED_Checkout_1234567892.png
```

## 🎨 Características del Reporte HTML

### Interfaz Interactiva
- **Header**: Título y descripción
- **Panel de Estadísticas**: Resumen de passed, failed, skipped y total
- **Features Expandibles**: Haz clic en cada feature para expandir/contraer
- **Navegación por Scenarios**: Visualiza cada scenario con su estado
- **Vista de Screenshots**: Grid de screenshots con vista previa

### Modal de Ampliación
- Haz clic en cualquier screenshot para verla en tamaño completo
- Cierra el modal haciendo clic en la X o fuera de la imagen

### Códigos de Color
- 🟢 **Verde**: Scenarios/Steps pasados
- 🔴 **Rojo**: Scenarios/Steps fallidos
- 🟡 **Amarillo**: Scenarios/Steps omitidos

## 📋 Configuración

### playwright.config.ts
Las siguientes opciones están configuradas para captura automática:

```typescript
use: {
  headless: true,                    // Navegador sin interfaz
  screenshot: 'only-on-failure',     // Capturar solo en fallos
  video: 'retain-on-failure',        // Videos en fallos
  trace: 'on-first-retry'            // Trace de Playwright
}
```

### cucumber.js
Configuración de formatters:

```javascript
format: [
  'progress',                              // Consola
  'json:reports/cucumber-report.json',    // JSON
  'html:reports/cucumber-report.html',    // HTML básico
  '@cucumber/pretty-formatter'            // Formato bonito
]
```

## 💡 Mejores Prácticas

### 1. Captura Estratégica
```typescript
// ✅ BIEN: Capturar en puntos críticos
When('el usuario completa el formulario', async function (this: CustomWorld) {
  await this.page.fill('[name="email"]', 'test@example.com');
  await this.page.fill('[name="password"]', 'password123');
  await this.captureScreenshot('Formulario completado');
  await this.page.click('button[type="submit"]');
});
```

### 2. Nombres Descriptivos
```typescript
// ✅ BIEN: Nombre claro y descriptivo
await this.captureScreenshot('Carrito con 3 productos');

// ❌ EVITAR: Nombres genéricos
await this.captureScreenshot('Screenshot 1');
```

### 3. Flujo Completo
```typescript
Then('verifico la compra', async function (this: CustomWorld) {
  await this.captureScreenshot('Página de confirmación antes de verificación');
  
  const message = await this.page.textContent('.confirmation-message');
  expect(message).to.include('¡Gracias por tu compra!');
  
  await this.captureScreenshot('Página de confirmación después de verificación');
});
```

## 🔧 Troubleshooting

### Screenshots no aparecen en el reporte
1. Verifica que las pruebas ejecuten correctamente: `npm test`
2. Revisa la carpeta `reports/screenshots/` para ver si hay archivos
3. Regenera el reporte: `npm run generate:html-report`

### El reporte HTML no se genera
1. Asegúrate de que existe `reports/cucumber-report.json`
2. Ejecuta primero las pruebas: `npm test`
3. Intenta regenerar manualmente: `npm run generate:html-report`

### Screenshots negras o borrosas
1. Aumenta el tiempo de espera antes de capturar:
   ```typescript
   await this.page.waitForSelector('.elemento-importante');
   await this.captureScreenshot('Elemento visible');
   ```
2. Usa `fullPage: true` (ya configurado por defecto)

## 📊 Scripts Disponibles

```bash
# ⭐ RECOMENDADO: Ejecutar pruebas y abrir reporte automáticamente
npm run test:report:open

# Ejecutar pruebas y generar reporte
npm run test:report

# Generar solo el reporte HTML (sin ejecutar pruebas)
npm run generate:html-report

# Ejecutar pruebas
npm test

# Generar reporte Allure (opcional, si configuraste Allure)
npm run generate:allure
```

## 🔄 Integración Continua

Para usar esto en tu pipeline CI/CD:

```yaml
# Ejemplo con GitHub Actions
- name: Run tests and generate report
  run: npm run test:report

- name: Upload report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: test-report
    path: reports/
```

## 📝 Notas Importantes

- Las screenshots se guardan como **PNG de página completa** (fullPage)
- Los nombres de archivo se generan con **timestamp** para evitar sobrescrituras
- El reporte HTML es **autoexplicativo** y no requiere dependencias externas
- Puedes **compartir el archivo HTML** como reporte con el equipo
- Las screenshots se guardan en **reports/screenshots/** por defecto

---

¡Disfruta de tus reportes detallados con snapshots! 📸✨
