const CACHE_NAME="vr-explorer-v9";
const ASSETS_TO_CACHE=[
  "/ExplorerTest9/",
  "/ExplorerTest9/index.html",
  "/ExplorerTest9/manifest.json",
  "/ExplorerTest9/icons/icon-192.png",
  "/ExplorerTest9/icons/icon-512.png",
  "/ExplorerTest9/icons/icon-maskable-192.png",
  "/ExplorerTest9/icons/icon-maskable-512.png"
];

self.addEventListener("install", e=>{
    e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS_TO_CACHE)));
    self.skipWaiting();
});

self.addEventListener("activate", e=>{
    e.waitUntil(caches.keys().then(keys=>Promise.all(
        keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))
    )));
    self.clients.claim();
});

self.addEventListener("fetch", e=>{
    e.respondWith(
        fetch(e.request)
        .then(resp=>{caches.open(CACHE_NAME).then(c=>c.put(e.request, resp.clone())); return resp;})
        .catch(()=>caches.match(e.request))
    );
});
