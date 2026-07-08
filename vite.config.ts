import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: './',
  build: {
    sourcemap: 'hidden',
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      timeout: 30000,
      overlay: false,
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  plugins: [
    react(),
    tsconfigPaths()
  ],
})
