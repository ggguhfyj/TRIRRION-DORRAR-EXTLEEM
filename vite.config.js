import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    headers: securityHeaders,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    headers: securityHeaders,
  },
})
