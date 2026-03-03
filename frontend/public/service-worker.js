// Service Worker for Expense Tracker PWA
// Version: 1.0.1 - Network First Strategy
// Always fetches latest content, falls back to cache when offline

const CACHE_VERSION = 'expense-tracker-v2'

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  self.skipWaiting()
})

// Fetch event - NETWORK FIRST strategy (always get fresh content)
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    // Try network first
    fetch(event.request)
      .then((response) => {
        // Clone and cache the fresh response
        const responseToCache = response.clone()
        
        caches.open(CACHE_VERSION).then((cache) => {
          cache.put(event.request, responseToCache)
        })
        
        return response
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          
          // For navigation requests, return cached index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html')
          }
          
          return new Response('Offline', { status: 503 })
        })
      })
  )
})

// Activate event - clean up old caches and take control immediately
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_VERSION) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim()
    })
  )
})

console.log('Service Worker loaded - Network First')
