import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          motion: ['framer-motion', 'motion', 'gsap'],
        },
      },
    },
    // three + @react-three/fiber/drei is a genuinely large, deliberate vendor
    // chunk (rendered immediately by the hero, not lazy-loadable) — raised so
    // the warning only fires on unexpected bloat, not this known chunk.
    chunkSizeWarningLimit: 1000,
  },
})
