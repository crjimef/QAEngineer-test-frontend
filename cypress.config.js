import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import mochawesome from "cypress-mochawesome-reporter/plugin";
import cypressOnFix from 'cypress-on-fix';

export default defineConfig({
  e2e: {
    video: false,   
    videosFolder: "cypress/videos", 
    videoCompression: 32, 
    baseUrl: "http://localhost:5173",
    specPattern: "**/*.feature",
    viewportWidth: 1280,
    viewportHeight: 720,
    retries: { runMode: 2, openMode: 1 },  

    // 🔹 Configurar múltiples reportes (JUnit + Mochawesome)
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      reporterEnabled: "mochawesome, mocha-junit-reporter",
      mochawesomeReporterOptions: {
        reportDir: "cypress/reports/e2e",
        overwrite: false,
        html: true,
        json: true,
        reportFilename: "[name]-[timestamp]"
      },
      mochaJunitReporterReporterOptions: {
        mochaFile: "cypress/reports/e2e/results-[hash].xml",
        toConsole: true
      }
    },

    async setupNodeEvents(on, config) {
      on = cypressOnFix(on);
      mochawesome(on);
      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({ plugins: [createEsbuildPlugin(config)] })
      );
      on("after:run", async () => {
        const report = await merge({
          files: ["cypress/reports/e2e/*.json"],
        });
      });
      return config;
    }
  },

  component: {
    video: false, 
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      reporterEnabled: "mochawesome, mocha-junit-reporter",
      mochawesomeReporterOptions: {
        reportDir: "cypress/reports/comp",
        overwrite: false,
        html: true,
        json: true,
        reportFilename: "[name]-[timestamp]"
      },
      mochaJunitReporterReporterOptions: {
        mochaFile: "cypress/reports/comp/results-[hash].xml",
        toConsole: true
      }
    },
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: "./vite.config.js",
    },
    setupNodeEvents(on, config) {
      mochawesome(on);
      on("after:run", async () => {
        const report = await merge({
          files: ["cypress/reports/comp/*.json"],
        });
      });
      return config;
    }
  }
});
