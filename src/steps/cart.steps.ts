import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { LoginPage } from '../pages/login.page.ts';
import { ProductsPage } from '../pages/products.page.ts';
import { CartPage } from '../pages/cart.page.ts';
import { CustomWorld } from '../support/world.ts';

let loginPage: LoginPage;
let productsPage: ProductsPage;
let cartPage: CartPage;

Given('the user logs in', async function (this: CustomWorld) {
  loginPage = new LoginPage(this.page);
  await loginPage.navigate();
  await loginPage.login(process.env.VALID_USERNAME!, process.env.VALID_PASSWORD!);

  productsPage = new ProductsPage(this.page);
  cartPage = new CartPage(this.page);
});

When('the user adds the product {string} to the cart', async function (this: CustomWorld, productName) {
  await productsPage.addProduct(productName);
  await productsPage.goToCart();
});

Then('the product {string} should be visible in the cart', async function (this: CustomWorld, productName) {
  const items = await cartPage.getCartItems();
  expect(items).to.include(productName);
});
