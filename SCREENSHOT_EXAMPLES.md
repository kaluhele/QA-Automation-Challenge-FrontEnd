/**
 * EJEMPLO DE USO DE CAPTURA DE SCREENSHOTS EN STEPS
 * 
 * Este archivo muestra cómo integrar capturas de screenshots en tus
 * step definitions usando el método captureScreenshot() de CustomWorld
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { expect } from 'chai';

// ============================================
// EJEMPLO 1: Login
// ============================================

Given('el usuario navega a la página de login', async function (this: CustomWorld) {
  // Navegar a la página
  await this.page.goto('https://example.com/login');
  
  // Capturar screenshot de la página de login
  await this.captureScreenshot('Página de login inicial');
});

When('el usuario completa el formulario de login con credenciales válidas', async function (this: CustomWorld) {
  // Llenar email
  await this.page.fill('[name="email"]', 'usuario@example.com');
  
  // Llenar password
  await this.page.fill('[name="password"]', 'contraseña123');
  
  // Capturar screenshot con el formulario completado
  await this.captureScreenshot('Formulario de login completo');
  
  // Hacer clic en submit
  await this.page.click('button[type="submit"]');
  
  // Esperar a que se cargue la página siguiente
  await this.page.waitForNavigation();
});

Then('el usuario debería ver el dashboard', async function (this: CustomWorld) {
  // Capturar screenshot del dashboard
  await this.captureScreenshot('Dashboard después del login');
  
  // Verificar que estamos en el dashboard
  const heading = await this.page.textContent('h1');
  expect(heading).to.include('Dashboard');
});

// ============================================
// EJEMPLO 2: Agregar producto al carrito
// ============================================

When('el usuario busca un producto', async function (this: CustomWorld) {
  // Escribir en el buscador
  await this.page.fill('[placeholder="Buscar productos"]', 'laptop');
  
  // Presionar Enter
  await this.page.press('[placeholder="Buscar productos"]', 'Enter');
  
  // Esperar a que carguen los resultados
  await this.page.waitForSelector('.product-item');
  
  // Capturar screenshot de los resultados
  await this.captureScreenshot('Resultados de búsqueda de laptop');
});

When('el usuario hace clic en el primer producto', async function (this: CustomWorld) {
  // Hacer clic en el primer producto
  await this.page.click('.product-item:first-child');
  
  // Esperar a que cargue la página del producto
  await this.page.waitForSelector('.product-details');
  
  // Capturar screenshot de la página del producto
  await this.captureScreenshot('Página de detalles del producto');
});

When('el usuario agrega el producto al carrito', async function (this: CustomWorld) {
  // Cambiar cantidad si es necesario
  await this.page.fill('[name="quantity"]', '2');
  
  // Capturar antes de agregar
  await this.captureScreenshot('Producto con cantidad definida');
  
  // Hacer clic en agregar al carrito
  await this.page.click('button:has-text("Agregar al carrito")');
  
  // Esperar notificación de éxito
  await this.page.waitForSelector('.notification-success', { timeout: 5000 });
  
  // Capturar después de agregar
  await this.captureScreenshot('Notificación de producto agregado');
});

// ============================================
// EJEMPLO 3: Verificación con múltiples screenshots
// ============================================

Then('el carrito contiene los productos correctos', async function (this: CustomWorld) {
  // Navegar al carrito
  await this.page.click('a:has-text("Carrito")');
  
  // Esperar a que cargue el carrito
  await this.page.waitForSelector('.cart-items');
  
  // Capturar screenshot del carrito completo
  await this.captureScreenshot('Carrito con productos');
  
  // Obtener cantidad de items
  const itemCount = await this.page.locator('.cart-item').count();
  
  // Capturar screenshot mostrando cantidad
  await this.captureScreenshot(`Carrito con ${itemCount} items`);
  
  // Verificaciones
  expect(itemCount).to.be.greaterThan(0);
});

// ============================================
// EJEMPLO 4: Checkout
// ============================================

When('el usuario procede al checkout', async function (this: CustomWorld) {
  // Capturar antes de checkout
  await this.captureScreenshot('Carrito antes de checkout');
  
  // Hacer clic en checkout
  await this.page.click('button:has-text("Proceder al pago")');
  
  // Esperar a que cargue la página de checkout
  await this.page.waitForSelector('.checkout-form');
  
  // Capturar página de checkout
  await this.captureScreenshot('Página de checkout');
});

When('el usuario completa los datos de envío', async function (this: CustomWorld) {
  // Llenar formulario de envío
  await this.page.fill('[name="street"]', 'Calle Principal 123');
  await this.page.fill('[name="city"]', 'Madrid');
  await this.page.fill('[name="zip"]', '28001');
  
  // Capturar formulario completo
  await this.captureScreenshot('Datos de envío completados');
});

When('el usuario selecciona el método de pago', async function (this: CustomWorld) {
  // Seleccionar método de pago
  await this.page.click('input[value="credit-card"]');
  
  // Llenar datos de tarjeta
  await this.page.fill('[name="card-number"]', '4111111111111111');
  await this.page.fill('[name="expiry"]', '12/25');
  await this.page.fill('[name="cvv"]', '123');
  
  // Capturar método de pago seleccionado
  await this.captureScreenshot('Método de pago configurado');
});

Then('el usuario debería ver la confirmación de compra', async function (this: CustomWorld) {
  // Capturar antes de confirmar
  await this.captureScreenshot('Resumen de compra final');
  
  // Hacer clic en confirmar
  await this.page.click('button:has-text("Confirmar compra")');
  
  // Esperar a la página de confirmación
  await this.page.waitForSelector('.confirmation-message', { timeout: 10000 });
  
  // Capturar confirmación
  await this.captureScreenshot('Compra confirmada exitosamente');
  
  // Verificar mensaje
  const message = await this.page.textContent('.confirmation-message');
  expect(message).to.include('¡Gracias por tu compra!');
});

// ============================================
// EJEMPLO 5: Manejo de errores con screenshots
// ============================================

When('el usuario intenta completar una acción inválida', async function (this: CustomWorld) {
  try {
    // Intentar una acción que podría fallar
    await this.page.click('button[disabled]', { force: true });
    
    // Si llegamos aquí, capturar el estado
    await this.captureScreenshot('Estado después de acción forzada');
  } catch (error) {
    // Capturar screenshot del error
    await this.captureErrorScreenshot('Intento de acción inválida');
    
    // Re-lanzar el error para que falle el scenario
    throw error;
  }
});

// ============================================
// TIPS IMPORTANTES:
// ============================================
/*
 * 1. NOMBRES DESCRIPTIVOS:
 *    - Usa nombres que describan claramente qué se está capturando
 *    - Los espacios se convierten automáticamente a guiones bajos
 * 
 * 2. PUNTO ESTRATÉGICO:
 *    - Captura después de navegaciones completadas
 *    - Captura antes de verificaciones importantes
 *    - Captura después de llenar formularios
 * 
 * 3. ERRORES:
 *    - Los errores se capturan automáticamente en hooks
 *    - Pero puedes capturar manualmente también
 * 
 * 4. RENDIMIENTO:
 *    - Demasiadas screenshots ralentizan las pruebas
 *    - Usa solo en puntos críticos
 *    - El tamaño de las screenshots es de página completa
 * 
 * 5. REPORTES:
 *    - Todas las screenshots se agrupan en el reporte HTML
 *    - Se generan con timestamp para evitar duplicados
 *    - Se organiza por feature y scenario automáticamente
 * 
 * 6. WAITS:
 *    - Siempre espera a que el elemento esté visible antes de capturar
 *    - Usa waitForSelector() para elementos dinámicos
 *    - Usa waitForNavigation() después de hacer clic en links
 */
