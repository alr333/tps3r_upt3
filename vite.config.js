// EDIT: Tambah plugin atau manualChunks di sini.
// COMMAND: Jalankan npm.cmd run build setelah mengubah konfigurasi.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ['recharts'],
          icons: ['lucide-react'],
          excel: ['xlsx'],
        },
      },
    },
  },
})
