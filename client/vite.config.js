import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base path ensures assets resolve correctly on GitHub Pages subpaths and root domains (Vercel).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || './',
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
