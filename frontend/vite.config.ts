import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: 5173,
    strictPort: true,
    open: true,
    proxy: {
      '/auth': { target: 'http://localhost:3000', changeOrigin: true },
      '/items': { target: 'http://localhost:3000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:3000', changeOrigin: true },
      '/admins': { target: 'http://localhost:3000', changeOrigin: true }, // p/ nova página
    },
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
})
