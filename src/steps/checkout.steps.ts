import { When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { CartPage } from '../pages/cart.page.ts';
import { CheckoutPage } from '../pages/checkout.page.ts';
import { CustomWorld } from '../support/world.ts';

let cartPage: CartPage;
let checkoutPage: CheckoutPage;

When('the user proceeds to checkout with data {string} {string} {string}', 
  async function (this: CustomWorld, firstName, lastName, postalCode) {
    cartPage = new CartPage(this.page);
    checkoutPage = new CheckoutPage(this.page);

    await cartPage.checkout();
    await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode);
    await checkoutPage.finishCheckout();
});

Then('the confirmation message {string} should be visible', async function (this: CustomWorld, expectedMessage) {
  const message = await checkoutPage.getConfirmationMessage();
  expect(message).to.include(expectedMessage);
});
