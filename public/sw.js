const CACHE_NAME = "seniorang-app-cache-v1";
const urlsToCache = ["/", "/manifest.json", "/images/seniorang-logo.svg"];

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing (seniorang)...");
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.log("Cache failed:", err);
      }),
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  // GET 요청만 캐시 처리 (POST, PUT, DELETE 등은 캐시하지 않음)
  if (event.request.method !== "GET") {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }),
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating (seniorang)...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Push notification event
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "새로운 알림이 있습니다",
    icon: "/images/seniorang-logo.svg",
    badge: "/images/seniorang-logo.svg",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "2",
    },
    actions: [
      {
        action: "explore",
        title: "확인하기",
        icon: "/images/seniorang-logo.svg",
      },
      {
        action: "close",
        title: "닫기",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("시니어랑", options));
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});
