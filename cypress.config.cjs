
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
      return config;
    },
  },
  env: {
    apiUrl: 'http://127.0.0.1:8000/api'
  }
});
