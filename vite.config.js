import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from "vite-plugin-istanbul";

export default defineConfig({
  plugins: [
    react(),
    istanbul({
      cypress: true,
      requireEnv: false,
      nycrcPath: './.nycrc.json',
      forceBuildInstrument: true,
    })
  ],
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      cache: false,
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        sourcemap: false,
        format: 'iife',
        amd: true
      },
      preserveEntrySignatures: true
    }
  },
  css: {
    devSourcemap: false
  },
  server: {
    port: 5173
  },
  define: {
    LOG_CONTEXTS: false,
    LEGACY_ROUTES_REDIRECT: false
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setup-tests.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['json', 'lcov', 'json-summary'],
      reportsDirectory: './unit-coverage'
    }
  }
});