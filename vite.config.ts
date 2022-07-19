import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteESLint from 'vite-plugin-eslint'
import vitePluginImp from 'vite-plugin-imp'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteESLint(),
    vitePluginImp({
      libList: [
        {
          libName: 'antd',
          style: name => `antd/lib/${name}/style/index.less`,
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@react': path.resolve(__dirname, './packages/react'),
      '@type': path.resolve(__dirname, './packages/react/types'),
      '@react-dom': path.resolve(__dirname, './packages/react-dom'),
      '@form': path.resolve(__dirname, './packages/form'),
      '@myFormily': path.resolve(__dirname, './packages/formily'),
      '@redux': path.resolve(__dirname, './packages/redux'),
      '@router': path.resolve(__dirname, './packages/router'),
      '@utils': path.resolve(__dirname, './utils.ts'),
      '@src': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      },
    },
  },
})
