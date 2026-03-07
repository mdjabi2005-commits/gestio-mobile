import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'Gestio',
                short_name: 'Gestio',
                description: 'Gestion financière personnelle',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/pyodide\/.*\/pyodide\.js$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'pyodide-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/pyodide\/.*\/.*\.wasm$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'pyodide-wasm-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*\.whl$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'pyodide-packages-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                            }
                        }
                    }
                ]
            }
        }),
        {
            name: 'serve-python-api',
            configureServer(server) {
                server.middlewares.use('/api.py', (_req, res) => {
                    const apiPath = resolve(__dirname, '../backend/api.py')
                    res.setHeader('Content-Type', 'text/plain')
                    try {
                        const content = readFileSync(apiPath, 'utf-8')
                        res.end(content)
                    } catch {
                        res.status(404).end('Not found')
                    }
                })
            },
        },
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL('.', import.meta.url)),
        },
    },
    worker: {
        format: 'es',
    },
})
