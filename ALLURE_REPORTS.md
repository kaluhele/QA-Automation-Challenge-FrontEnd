# 📊 Allure Reports - Guía Completa

Allure es un framework de reportes moderno y gráfico que proporciona visualizaciones detalladas de tus tests con soporte para screenshots, videos, timeline, y mucho más.

---

## 🚀 Inicio Rápido

### ⭐ Ejecutar Tests y Abrir Reporte Allure

```bash
npm run test:allure:open
```

Este comando:
1. ✅ Ejecuta todas las pruebas
2. ✅ Captura screenshots automáticamente
3. ✅ Genera reporte Allure con datos gráficos
4. ✅ Abre automáticamente en tu navegador

---

## 📁 Estructura de Reportes

```
reports/
├── allure-report/              # Reporte gráfico de Allure ⭐
├── allure-results/             # Datos JSON para Allure
├── cucumber-report.json        # Datos de Cucumber
├── cucumber-report.html        # Reporte HTML simple
└── screenshots/                # Screenshots capturadas
```

---

## 🎯 Características de Allure

### 1. **Dashboard Principal**
- 📊 Gráficos circulares con estadísticas
- ⏱️ Duración de tests
- 📈 Historial de ejecuciones
- 🎯 Tasa de éxito

### 2. **Detalles por Scenario**
- 📝 Pasos ejecutados con timeline
- 🖼️ Screenshots integradas
- ⚠️ Stack traces de errores
- 📌 Etiquetas y categorías

### 3. **Visualizaciones**
- 🔄 Timeline de ejecución
- 📊 Distribución de estados
- 📈 Gráficos de duración
- 🎭 Categorías de tests

---

## 📸 Usar Snapshots con Allure

### Captura Automática en Fallos

Las screenshots se capturan automáticamente en tus tests fallidos:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Then('verifico el resultado', async function (this: CustomWorld) {
  // Si esto falla, se captura screenshot automáticamente
  const text = await this.page.textContent('.result');
  expect(text).to.equal('Success');
});
```

### Captura Manual

Captura screenshots en puntos específicos:

```typescript
When('el usuario completa el formulario', async function (this: CustomWorld) {
  await this.page.fill('[name="email"]', 'user@example.com');
  await this.page.fill('[name="password"]', 'pass123');
  
  // Capturar screenshot - aparecerá en Allure
  await this.captureScreenshot('Formulario completado');
  
  await this.page.click('button[type="submit"]');
});
```

### Captura de Error Manual

```typescript
Then('verifico datos críticos', async function (this: CustomWorld) {
  try {
    const balance = await this.page.textContent('.balance');
    expect(balance).to.include('$1000');
  } catch (error) {
    // Capturar error para evidencia
    await this.captureErrorScreenshot('Verificación de balance fallida');
    throw error;
  }
});
```

---

## 🖼️ Las Screenshots en Allure

Cuando ejecutas `npm run test:allure:open`, las screenshots aparecen:

### En Fallos
- Automáticamente se captura la pantalla en el momento del fallo
- Se adjunta como evidencia visual al reporte

### En Steps Manuales
- Cualquier `captureScreenshot()` aparece en Allure
- Se muestra bajo el step que la capturó

### Visualización
- Haz clic en cualquier screenshot para ampliarla
- Ver en zoom completo
- Comparar múltiples screenshots

---

## 📊 Scripts Disponibles

```bash
# ⭐ RECOMENDADO: Ejecutar tests y abrir Allure automáticamente
npm run test:allure:open

# Ejecutar tests y generar reporte Allure (sin abrir)
npm run test:allure

# Solo abrir reporte Allure existente
npm run open:allure

# Generar reporte Allure (sin ejecutar tests)
npm run generate:allure

# Ejecutar tests solo (sin generar reporte)
npm test

# Generar reporte HTML simple (sin Allure)
npm run test:report:open
```

---

## 🎨 Estructura de un Reporte Allure

### Header
- Título y tiempo total
- Botones de navegación
- Versión del reporte

### Sidebar
- **Suites**: Organización de features
- **Tests**: Listado completo de scenarios
- **Graphs**: Visualizaciones
- **Timeline**: Orden de ejecución
- **Categories**: Categorización de fallos

### Content
- Estado del test (✅ Passed, ❌ Failed, ⏭️ Skipped)
- Steps con duración individual
- Screenshots adjuntas
- Historial de ejecuciones

---

## 📋 Mejor Prácticas con Allure

### 1. Captura Estratégica
```typescript
// ✅ BIEN: Capturar en puntos clave
When('el usuario se autentica', async function (this: CustomWorld) {
  await this.page.fill('[name="username"]', 'testuser');
  await this.page.fill('[name="password"]', 'password');
  await this.captureScreenshot('Login form filled');  // Antes de enviar
  
  await this.page.click('button[type="submit"]');
  await this.page.waitForNavigation();
  await this.captureScreenshot('Logged in successfully');  // Después
});
```

### 2. Nombres Descriptivos
```typescript
// ✅ BIEN
await this.captureScreenshot('Shopping cart with 3 items');

// ❌ EVITAR
await this.captureScreenshot('Screenshot 1');
```

### 3. Fallos Capturados
```typescript
// Las screenshots de error se capturan automáticamente
Then('verifico el total', async function (this: CustomWorld) {
  const total = await this.page.textContent('.total-price');
  // Si falla, Allure captura automáticamente la screenshot
  expect(total).to.include('$99.99');
});
```

---

## 🔧 Integración Continua

### GitHub Actions
```yaml
- name: Run Tests with Allure Report
  run: npm run test:allure:open

- name: Upload Allure Report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: allure-report
    path: reports/allure-report/
```

---

## 📱 Características Avanzadas

### Filtrado
- Filtrar por estado (Passed, Failed, Skipped)
- Filtrar por duración
- Filtrar por feature/etiqueta

### Búsqueda
- Buscar por nombre de test
- Buscar por mensaje de error
- Búsqueda global

### Historial
- Ver ejecuciones anteriores
- Comparar resultados
- Tendencias de test

### Exportar
- Descargar reportes
- Compartir via URL
- Integración con ReportPortal

---

## 🐛 Troubleshooting

### Las screenshots no aparecen en Allure

1. Verifica que `captureScreenshot()` se está llamando
2. Revisa la carpeta `reports/screenshots/`
3. Regenera el reporte: `npm run test:allure:open`

### Allure no se genera

1. Instala dependencias: `npm install`
2. Limpia reportes: `rm -rf reports/allure-results`
3. Ejecuta: `npm run test:allure:open`

### Error al abrir reporte

1. Verifica que Node.js 14+ está instalado
2. Instala Allure: `npm install --save-dev allure-commandline`
3. Usa: `npm run open:allure`

---

## 📚 Recursos

- [Documentación Allure](https://docs.qameta.io/allure/)
- [GitHub Allure](https://github.com/allure-framework)
- [Cucumber Allure Adapter](https://github.com/allure-framework/allure-js)

---

## 📝 Ejemplo Completo

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { expect } from 'chai';

// Feature: Shopping Cart
// Scenario: Add multiple products to cart

Given('el usuario está en la tienda', async function (this: CustomWorld) {
  await this.page.goto('https://shop.example.com');
  await this.captureScreenshot('Tienda cargada');
});

When('agrega {int} productos al carrito', async function (this: CustomWorld, quantity: number) {
  for (let i = 0; i < quantity; i++) {
    await this.page.click('.add-to-cart');
    await this.captureScreenshot(`Producto ${i + 1} agregado`);
  }
});

Then('el carrito muestra {int} productos', async function (this: CustomWorld, expected: number) {
  await this.captureScreenshot('Carrito antes de verificación');
  
  const count = await this.page.locator('.cart-item').count();
  expect(count).to.equal(expected);
  
  await this.captureScreenshot('Verificación completada');
});
```

**Resultado en Allure:**
- ✅ Scenario: Add multiple products to cart
- 📸 Screenshot: Tienda cargada
- 📸 Screenshot: Producto 1 agregado
- 📸 Screenshot: Producto 2 agregado
- 📸 Screenshot: Carrito antes de verificación
- ✅ Paso: el carrito muestra 2 productos
- 📸 Screenshot: Verificación completada

---

¡Disfruta de tus reportes gráficos con Allure! 🎉✨
