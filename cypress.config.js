import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";


export default defineConfig({
  e2e: {
    video: false,   // This enables video recording
    videosFolder: "cypress/videos", // Folder where videos will be saved
    videoCompression: 32, // Compression level (0 for no compression)
    baseUrl: "http://localhost:5173",
    specPattern: "**/*.feature",
    viewportWidth: 1280,  // Set the default viewport width
    viewportHeight: 720,  // Set the default viewport height
    async setupNodeEvents(on, config) {
      // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
      await addCucumberPreprocessorPlugin(on, config)

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)]
        })
      )
      return config
    }
  },

  component: {
    reporter: 'mochawesome',
    devServer: {
      framework: 'react',
      bundler: 'vite',
      // optionally pass in vite config
      viteConfig: './vite.config.js',
    }
  }
});

