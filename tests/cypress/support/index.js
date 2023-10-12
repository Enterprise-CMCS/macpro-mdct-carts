/*
 * ***********************************************************
 * This example support/index.js is processed and
 * loaded automatically before your test files.
 *
 * This is a great place to put global configuration and
 * behavior that modifies Cypress.
 *
 * You can change the location of this file or turn off
 * automatically serving support files with the
 * 'supportFile' configuration option.
 *
 * You can read more here:
 * https://on.cypress.io/configuration
 * ***********************************************************
 */
// Import commands.js using ES2015 syntax:
import "./commands";

/*
 * This is a Cypress plugin that allows you to run axe (https://dequeuniversity.com/rules/axe/about) on
 * your tests.
 */
import "cypress-axe";
