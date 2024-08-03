import { build, files, prerendered, version } from "$service-worker";

const APP_CACHE = `app-cache-v${version}`;
const STATIC_CACHE = `static-cache-v${version}`;
const DYNAMIC_CACHE = `dynamic-cache-v${version}`;

const RESOURCES = [...build, ...prerendered];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(APP_CACHE).then((cache) => cache.addAll(RESOURCES)),
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(files)),
    ]).then(self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    clients.claim(),
    caches
      .keys()
      .then((keys) => {
        const CACHE_LIST = [APP_CACHE, STATIC_CACHE, DYNAMIC_CACHE];

        return Promise.all(
          keys
            .filter((key) => !CACHE_LIST.includes(key))
            .map((key) => caches.delete(key))
        );
      })
      .then(self.skipWaiting())
  );
});

self.addEventListener("fetch", (evt) => {
  const request = evt.request;

  evt.respondWith(
    fetch(request)
      .then((fetchResponse) => {
        return fetchResponse;
      })
      .catch(() => {
        if (request.url.indexOf(".html") > -1) {
          return caches.match("/offline");
        }
      })
  );
});
