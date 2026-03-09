self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('active', () => {
  console.log('Service Worker activo')
})