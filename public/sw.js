const CACHE_NAME = "arwani-store-cache-v1";
const ASSETS = [
  "/",
  "/semua-produk",
  "/tentang-kami",
  "/bantuan",
  "/kontak",
  "/globals.css",
  "/favicon.ico",
  "/telkomsel.png",
  "/byu.png",
  "/indosat.png",
  "/xl.png",
  "/tri.png",
  "/smartfren.png"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching App Shell static assets");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Service Worker: Clearing Old Cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Interceptor Event
self.addEventListener("fetch", (event) => {
  // Only handle GET requests and skip next/webpack internal socket calls or external admin tools
  if (event.request.method !== "GET" || event.request.url.includes("/_next/") || event.request.url.includes("hot-update")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch new copy in background (stale-while-revalidate style)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => { /* silent ignore offline */ });
        
        return cachedResponse;
      }
      
      return fetch(event.request).then((networkResponse) => {
        // Cache successful requests dynamically
        if (networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for document pages when offline
        if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/");
        }
      });
    })
  );
});
