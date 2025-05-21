// Basic service worker for PWA functionality
self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  return self.clients.claim();
});

// // Cache assets and handle fetch requests
// self.addEventListener("fetch", (event) => {
//   // Add caching logic here if needed
//   event.respondWith(fetch(event.request));
// });
