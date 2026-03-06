import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
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
