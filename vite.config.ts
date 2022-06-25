import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteESLint from 'vite-plugin-eslint'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteESLint()],
  resolve: {
    alias: {
      '@react': path.resolve(__dirname, './react'),
      '@type': path.resolve(__dirname, './react/types'),
      '@utils': path.resolve(__dirname, './utils.ts'),
    },
  },
})
