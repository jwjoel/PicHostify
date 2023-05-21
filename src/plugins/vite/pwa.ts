/**
 * Zero config PWA for Vite
 * Plugin: vite-plugin-pwa
 * https://github.com/antfu/vite-plugin-pwa
 */
import { VitePWA } from 'vite-plugin-pwa'

export default function configPWAPlugin() {
  return VitePWA({
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    manifest: {
      name: 'PicHostify',
      short_name: 'PicHostify',
      description: 'PicHostify is a GitHub API based image hosting platform',
      icons: [
        {
          src: './logo.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: './logo.png',
          sizes: '192x192',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      skipWaiting: true
    }
  })
}
