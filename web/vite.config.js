import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'NordPath — Asystent Sprawdzania Egzaminów',
        short_name: 'NordPath',
        description: 'Aplikacja pomagająca nauczycielom szybciej sprawdzać zebrane prace pisemne uczniów.',
        theme_color: '#6d3bd1',
        background_color: '#fafafa',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
})
