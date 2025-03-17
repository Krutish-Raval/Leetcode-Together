import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/jokes': 'http://localhost:3000',
    },
  },
  plugins: [react()],
})
