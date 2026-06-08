# ⚡ Quick Start - Allure Reports + Snapshots

## ⭐ Comando Único para Todo

```bash
npm run test:allure:open
```

Esto ejecuta:
1. ✅ Pruebas
2. ✅ Captura screenshots
3. ✅ Genera reporte **Allure profesional y gráfico**
4. ✅ Abre en navegador

---

## 🎨 Lo que Verás en Allure

- 📊 Dashboard con gráficos bonitos
- 📈 Estadísticas de tests (Passed/Failed/Skipped)
- ⏱️ Duración de cada test
- 🖼️ Screenshots integradas en cada paso
- 📝 Timeline de ejecución
- 🎭 Categorización de fallos

---

## 📸 Usar Snapshots en tus Tests

En cualquier `step definition`:

```typescript
import { CustomWorld } from '../support/world';
import { When } from '@cucumber/cucumber';

When('algo ocurre', async function (this: CustomWorld) {
  // Tu código...
  
  // Capturar screenshot - aparecerá en Allure
  await this.captureScreenshot('Mi snapshot descriptivo');
});
```

**La screenshot aparecerá automáticamente en el reporte Allure** 📸

---

## 📊 Otros Comandos

```bash
# Ejecutar tests y generar reporte (sin abrir navegador)
npm run test:allure

# Solo abrir reporte Allure existente
npm run open:allure

# Solo ejecutar tests
npm test
```

---

## 📁 Dónde se Guardan

```
reports/
├── allure-report/          ← El reporte gráfico está aquí
└── screenshots/            ← Tus screenshots capturadas
```

---

## 📚 Documentación Completa

Lee [ALLURE_REPORTS.md](ALLURE_REPORTS.md) para:
- Configuración avanzada
- Mejores prácticas
- Ejemplos de código
- Troubleshooting

---

**¡Ejecuta `npm run test:allure:open` y disfruta del reporte gráfico!** 🎉✨
