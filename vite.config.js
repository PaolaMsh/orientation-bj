import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api-orientation-production.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
