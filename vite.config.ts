/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // Playwright specs under e2e/ are run by `npm run e2e`, not Vitest.
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
})
