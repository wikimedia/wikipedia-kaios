const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 240,
  viewportHeight: 290,
  videoUploadOnPasses: false,
  retries: 6,
  defaultCommandTimeout: 8000,
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://127.0.0.1:8080",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});
