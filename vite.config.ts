import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteESLint from 'vite-plugin-eslint'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteESLint()],
  resolve: {
    alias: {
      '@react': path.resolve(__dirname, './packages/react'),
      '@type': path.resolve(__dirname, './packages/react/types'),
      '@react-dom': path.resolve(__dirname, './packages/react-dom'),
      '@form': path.resolve(__dirname, './packages/form'),
      '@redux': path.resolve(__dirname, './packages/redux'),
      '@utils': path.resolve(__dirname, './utils.ts'),
      '@src': path.resolve(__dirname, './src'),
    },
  },
})
