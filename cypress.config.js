const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1000,  // Example width for a small mobile device
    viewportHeight: 660,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
