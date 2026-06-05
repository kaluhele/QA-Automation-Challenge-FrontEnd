import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { LoginPage } from '../pages/login.page.ts';
import * as dotenv from 'dotenv';

dotenv.config();

let loginPage: LoginPage;

Given('the user navigates to the login page', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.navigate();
});

When('they enter credentials {string} and {string}', async function (usernameKey: string, passwordKey: string) {
  const username = process.env[usernameKey];
  const password = process.env[passwordKey];

  if (!username || !password) {
    throw new Error(`Missing environment variable for ${usernameKey} or ${passwordKey}`);
  }

  await loginPage.login(username, password);
});

Then('they should see the products page', async function () {
  const url = this.page.url();
  assert.ok(url.includes('inventory.html'), 'Expected to be on products page');
});

Then('they should see an error message', async function () {
  const error = await loginPage.getErrorMessage();
  assert.ok(error && error.length > 0, 'Expected an error message');
});
