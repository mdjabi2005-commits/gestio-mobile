/// <reference lib="webworker" />
// webapp/public/sw.js
// Service Worker pour PWA - Cache Pyodide et assets

const CACHE_NAME = 'gestio-v1'
const PYODIDE_VERSION = 'v0.25.1'

// URLs à mettre en cache
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    // Pyodide core files
    `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/pyodide.mjs`,
    `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/pyodide.asm.js`,
    `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/pyodide.asm.wasm`,
    `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/pyodide.js`,
]

// Installation
self.addEventListener('install', (event: ExtendableEvent) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Mise en cache des assets')
            return cache.addAll(PRECACHE_URLS)
        }).then(() => {
            return self.skipWaiting()
        })
    )
})

// Activation
self.addEventListener('activate', (event: ExtendableEvent) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            )
        }).then(() => {
            return self.clients.claim()
        })
    )
})

// Fetch avec cache-first pour Pyodide, network-first pour le reste
self.addEventListener('fetch', (event: FetchEvent) => {
    const url = new URL(event.request.url)

    // Pyodide files - cache first
    if (url.href.includes('cdn.jsdelivr.net/pyodide')) {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) {
                    return cached
                }
                return fetch(event.request).then((response) => {
                    const clone = response.clone()
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone)
                    })
                    return response
                })
            })
        )
        return
    }

    // API calls - network only
    if (url.pathname.startsWith('/api')) {
        return
    }

    // Default - network first with cache fallback
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const clone = response.clone()
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, clone)
                })
                return response
            })
            .catch(() => {
                return caches.match(event.request)
            })
    )
})

export {}
