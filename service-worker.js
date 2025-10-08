const CACHE_NAME = "elegance-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/catalogue.html",
    "/style.css",
    "/script.js",
    "/manifest.json"
];

// Install Service Worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

// Activate and remove old caches
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(names => {
            return Promise.all(
                names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
            );
        })
    );
});

// Fetch resources
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
