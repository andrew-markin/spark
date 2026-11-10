import { fileURLToPath, URL } from 'node:url'

import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import iosSplashScreens from './plugins/ios-splash-screens.js'
import purgeCss from './plugins/purge-css.js'

const background = '#306ca1'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      includeAssets: ['favicon.svg', 'favicon.png', 'robots.txt'],
      workbox: {
        // The plugin enables these for autoUpdate only with its own registration
        // script, not with the inline one, so new versions would wait for all tabs to close
        skipWaiting: true,
        clientsClaim: true,
        // Flags (public/flags) included: the service worker is installed only once all of
        // them are loaded, so the courses work offline right after the first visit
        globPatterns: ['**/*.{js,css,html,png,svg,ttf,woff,woff2}'],
        // iOS reads launch screens when the app is added to the home screen, no need to cache them
        globIgnores: ['splash/**'],
        // Files with hashed names are cached by their names alone, except for stylesheets,
        // which keep their names when purged (see plugins/purge-css.js), checked by content
        dontCacheBustURLsMatching: /-[\w-]{8}\.(?!css$)\w+$/
      },
      manifest: {
        name: 'Spark',
        short_name: 'Spark',
        description:
          'Lightweight brain training app designed to boost your memory and cognitive skills',
        theme_color: background,
        background_color: background,
        orientation: 'portrait-primary',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),
    iosSplashScreens({ color: background }),
    purgeCss(),
    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar({
      sassVariables: fileURLToPath(new URL('./src/quasar-variables.sass', import.meta.url))
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(process.env.npm_package_version)
  }
})
