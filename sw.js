/* DoctorWealth service worker (optional companion to index.html).
   - The app shell is cached so the installed app opens with no network at all.
   - Pages: network first (so updates arrive), cache fallback when offline.
   - Parser libraries from the CDN (SheetJS, pdf.js): cached after first use.
   - Google APIs (Drive sync / sign-in) are never cached. */
var CACHE = "dw-shell-v11";
var SHELL = ["./", "./index.html"];
var CDN = /^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)\//;

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches["delete"](k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = req.url;
  if (CDN.test(url)) {
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      });
    }));
    return;
  }
  if (url.indexOf(self.location.origin) !== 0) return; /* googleapis etc: straight to network */
  e.respondWith(fetch(req).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  }, function () {
    return caches.match(req).then(function (hit) { return hit || caches.match("./index.html"); });
  }));
});
