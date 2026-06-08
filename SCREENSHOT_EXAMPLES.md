/**
 * EXAMPLE OF USING SCREENSHOT CAPTURE IN STEPS
 * 
 * This file shows how to integrate screenshot capture in your
 * step definitions using CustomWorld.captureScreenshot()
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { expect } from 'chai';

// ============================================
// EXAMPLE 1: Login
// ============================================

Given('the user navigates to the login page', async function (this: CustomWorld) {
  // Navigate to the page
  await this.page.goto('https://example.com/login');
  
  // Capture screenshot of the login page
  await this.captureScreenshot('Initial login page');
});

When('the user completes the login form with valid credentials', async function (this: CustomWorld) {
  // Fill email
  await this.page.fill('[name="email"]', 'user@example.com');
  
  // Fill password
  await this.page.fill('[name="password"]', 'password123');
  
  // Capture screenshot with the completed form
  await this.captureScreenshot('Completed login form');
  
  // Click submit
  await this.page.click('button[type="submit"]');
  
  // Wait for the next page to load
  await this.page.waitForNavigation();
});

Then('the user should see the dashboard', async function (this: CustomWorld) {
  // Capture screenshot of the dashboard
  await this.captureScreenshot('Dashboard after login');
  
  // Verify that we are on the dashboard
  const heading = await this.page.textContent('h1');
  expect(heading).to.include('Dashboard');
});

// ============================================
// EXAMPLE 2: Add product to cart
// ============================================

When('the user searches for a product', async function (this: CustomWorld) {
  // Type in the search field
  await this.page.fill('[placeholder="Search products"]', 'laptop');
  
  // Press Enter
  await this.page.press('[placeholder="Search products"]', 'Enter');
  
  // Wait for the results to load
  await this.page.waitForSelector('.product-item');
  
  // Capture screenshot of the results
  await this.captureScreenshot('Laptop search results');
});

When('the user clicks the first product', async function (this: CustomWorld) {
  // Click the first product
  await this.page.click('.product-item:first-child');
  
  // Wait for the product page to load
  await this.page.waitForSelector('.product-details');
  
  // Capture screenshot of the product page
  await this.captureScreenshot('Product details page');
});

When('the user adds the product to the cart', async function (this: CustomWorld) {
  // Change quantity if needed
  await this.page.fill('[name="quantity"]', '2');
  
  // Capture before adding
  await this.captureScreenshot('Product with defined quantity');
  
  // Click add to cart
  await this.page.click('button:has-text("Add to cart")');
  
  // Wait for success notification
  await this.page.waitForSelector('.notification-success', { timeout: 5000 });
  
  // Capture after adding
  await this.captureScreenshot('Product added notification');
});

// ============================================
// EXAMPLE 3: Verification with multiple screenshots
// ============================================

Then('the cart contains the correct products', async function (this: CustomWorld) {
  // Navigate to the cart
  await this.page.click('a:has-text("Cart")');
  
  // Wait for the cart to load
  await this.page.waitForSelector('.cart-items');
  
  // Capture screenshot of the full cart
  await this.captureScreenshot('Cart with products');
  
  // Get number of items
  const itemCount = await this.page.locator('.cart-item').count();
  
  // Capture screenshot showing item count
  await this.captureScreenshot(`Cart with ${itemCount} items`);
  
  // Verifications
  expect(itemCount).to.be.greaterThan(0);
});

// ============================================
// EXAMPLE 4: Checkout
// ============================================

When('the user proceeds to checkout', async function (this: CustomWorld) {
  // Capture before checkout
  await this.captureScreenshot('Cart before checkout');
  
  // Click checkout
  await this.page.click('button:has-text("Proceed to payment")');
  
  // Wait for the checkout page to load
  await this.page.waitForSelector('.checkout-form');
  
  // Capture checkout page
  await this.captureScreenshot('Checkout page');
});

When('the user completes shipping details', async function (this: CustomWorld) {
  // Fill shipping form
  await this.page.fill('[name="street"]', '123 Main St');
  await this.page.fill('[name="city"]', 'Madrid');
  await this.page.fill('[name="zip"]', '28001');
  
  // Capture completed form
  await this.captureScreenshot('Completed shipping details');
});

When('the user selects the payment method', async function (this: CustomWorld) {
  // Select payment method
  await this.page.click('input[value="credit-card"]');
  
  // Fill card details
  await this.page.fill('[name="card-number"]', '4111111111111111');
  await this.page.fill('[name="expiry"]', '12/25');
  await this.page.fill('[name="cvv"]', '123');
  
  // Capture selected payment method
  await this.captureScreenshot('Selected payment method');
});

Then('the user should see the purchase confirmation', async function (this: CustomWorld) {
  // Capture before confirming
  await this.captureScreenshot('Final purchase summary');
  
  // Click confirm
  await this.page.click('button:has-text("Confirm purchase")');
  
  // Wait for confirmation page
  await this.page.waitForSelector('.confirmation-message', { timeout: 10000 });
  
  // Capture confirmation
  await this.captureScreenshot('Purchase confirmed successfully');
  
  // Verify message
  const message = await this.page.textContent('.confirmation-message');
  expect(message).to.include('Thank you for your purchase!');
});

// ============================================
// EXAMPLE 5: Error handling with screenshots
// ============================================

When('the user tries to complete an invalid action', async function (this: CustomWorld) {
  try {
    // Attempt an action that may fail
    await this.page.click('button[disabled]', { force: true });
    
    // If we get here, capture the state
    await this.captureScreenshot('State after forced action');
  } catch (error) {
    // Capture screenshot of the error
    await this.captureErrorScreenshot('Invalid action attempt');
    
    // Re-throw the error so the scenario fails
    throw error;
  }
});

// ============================================
// IMPORTANT TIPS:
// ============================================
/*
 * 1. DESCRIPTIVE NAMES:
 *    - Use names that clearly describe what is being captured
 *    - Spaces are automatically converted to underscores
 * 
 * 2. STRATEGIC POINTS:
 *    - Capture after completed navigations
 *    - Capture before important assertions
 *    - Capture after filling forms
 * 
 * 3. ERRORS:
 *    - Errors are automatically captured in hooks
 *    - But you can capture manually too
 * 
 * 4. PERFORMANCE:
 *    - Too many screenshots slow down tests
 *    - Use only at critical points
 *    - Screenshot size is full page
 * 
 * 5. REPORTS:
 *    - All screenshots are grouped in the HTML report
 *    - They are generated with a timestamp to avoid duplicates
 *    - They are organized by feature and scenario automatically
 * 
 * 6. WAITS:
 *    - Always wait for the element to be visible before capturing
 *    - Use waitForSelector() for dynamic elements
 *    - Use waitForNavigation() after clicking links
 */
