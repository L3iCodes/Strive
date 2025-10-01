import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Use SWC instead
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), // SWC is faster and more stable
    tailwindcss(),
  ],
  server: {
    hmr: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query'],
  }
})