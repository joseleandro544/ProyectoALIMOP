import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Puerto de desarrollo
    host: true, // Fuerza a exponer en 0.0.0.0 para evitar bloqueos de IPv6/Windows
    strictPort: true,
  }
})
