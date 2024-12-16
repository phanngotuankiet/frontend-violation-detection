import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-iztro': path.resolve('/Users/airm1/git/react-iztro/lib/index.js'),
      'iztro-naikyo': path.resolve('/Users/airm1/git/iztro-naikyo/lib/index.js')
    }
  },
  optimizeDeps: {
    include: ['iztro-naikyo', 'react-iztro']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
