/// <reference types="vitest" />

import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  test: {
    environment: 'jsdom',
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: [resolve(__dirname, 'src/index.ts')],
      name: '@destyler/button',
      fileName: 'index',
      formats: ['es', 'umd', 'cjs'],
    },
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      external: ['vue', 'test'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})