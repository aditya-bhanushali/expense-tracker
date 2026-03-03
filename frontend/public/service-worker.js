// Service Worker for Expense Tracker PWA
// Version: 1.0.0
// Enables offline functionality, caching, and app installation

const CACHE_VERSION = 'expense-tracker-v1'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Caching app shell')
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
      ]).catch((error) => {
        console.log('Cache addAll error (expected during development):', error)
        return Promise.resolve()
      })
    })
  )
  
  // Immediately activate
  self.skipWaiting()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and non-GET requests
  if (event.request.method !== 'GET' || !event.request.url.includes(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse
      }

      // Fetch from network and cache
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache successful responses
          if (event.request.method === 'GET') {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }

          return response
        })
        .catch(() => {
          // Offline fallback - return cached index.html for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html')
          }
          
          // Return a generic offline response for other requests
          return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
          })
        })
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.includes(CACHE_VERSION)) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  // Take control of all pages immediately
  self.clients.claim()
})

console.log('Service Worker loaded')
