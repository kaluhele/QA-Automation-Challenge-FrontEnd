# ⚡ Quick Start - Reportes con Snapshots

## ⭐ Comando Recomendado (Abre automáticamente el reporte)

```bash
npm run test:report:open
```

**¿Qué hace?**
1. ✅ Ejecuta todas las pruebas
2. ✅ Captura screenshots automáticamente
3. ✅ Genera reporte HTML con snapshots integradas
4. ✅ Abre automáticamente en tu navegador 🎉

---

## Otros Comandos

### Ejecutar y generar reporte (sin abrir navegador)
```bash
npm run test:report
```

### Solo ejecutar pruebas (sin generar reporte)
```bash
npm test
```

### Generar reporte (sin ejecutar pruebas)
```bash
npm run generate:html-report
```

### Generar reporte Allure (opcional)
```bash
npm run generate:allure
```

---

## 📁 Archivos Generados

```
reports/
├── cucumber-report-with-snapshots.html  ← Abre este en tu navegador! 🎉
├── cucumber-report.json                 (JSON raw)
├── cucumber-report.html                 (HTML básico)
└── screenshots/                         (Todas las imágenes capturadas)
    ├── Login_page_123456789.png
    ├── Shopping_cart_123456790.png
    └── FAILED_Checkout_123456791.png
```

---

## 📸 Capturar Screenshots Manualmente

En cualquier step definition:

```typescript
// Importar el tipo
import { CustomWorld } from '../support/world';
import { When } from '@cucumber/cucumber';

When('ejemplo', async function (this: CustomWorld) {
  // Tu código...
  
  // Capturar screenshot
  await this.captureScreenshot('Nombre descriptivo aquí');
});
```

---

## 🎨 Características del Reporte

- 🎨 Interfaz moderna y responsiva
- 📊 Estadísticas en tiempo real (Passed/Failed/Skipped)
- 🖼️ Grid de screenshots con vista previa
- 🔍 Modal para ver screenshots en tamaño completo
- 📱 Totalmente responsive (funciona en móvil)
- 🎯 Expandible/Contraible por features
- 📝 Incluye paso a paso de cada scenario

---

## 📚 Documentación Completa

Para más detalles, lee:
- [REPORTING.md](REPORTING.md) - Guía completa
- [SCREENSHOT_EXAMPLES.md](SCREENSHOT_EXAMPLES.md) - Ejemplos de código

---

¡Eso es todo! Ahora ejecuta `npm run test:report:open` y disfruta de tus reportes 📸✨
