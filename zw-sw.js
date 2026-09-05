/* =========================================================
   ZahlenturmWahr — Service Worker
   Cache-Name bei jedem Deployment erhöhen: zahlenturmwahr-v15
========================================================= */

const CACHE_NAME = "zahlenturmwahr-v21";

const APP_SHELL = [
  "./",
  "./zw-index.html",
  "./zw-spiel.html",
  "./zw-style.css",
  "./zw-game.js",
  "./zw-manifest.json",
  "./zw-impressum.html",
  "./zw-datenschutz.html",
  "./zw-icon-192.png",
  "./zw-icon-512.png",
  "./zw-icon-maskable-192.png",
  "./zw-icon-maskable-512.png",
  "./zw-apple-touch-icon.png",
  "./zw-favicon-32.png",
  "./zw-favicon-64.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});
