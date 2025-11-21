import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Optimizaciones para PWA
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          store: ['zustand'],
          utils: ['html2canvas', 'jspdf', 'xlsx']
        }
      }
    },
    // Asegurar que los archivos estáticos tengan hash para caché efectivo
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000
  },
  // Configuración del servidor de desarrollo
  server: {
    host: true,
    port: 5173,
    headers: {
      'Service-Worker-Allowed': '/'
    }
  },
  // Configuración de preview
  preview: {
    host: true,
    port: 4173,
    headers: {
      'Service-Worker-Allowed': '/'
    }
  },
  // Optimización de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand']
  }
})
