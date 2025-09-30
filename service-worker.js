const CACHE_NAME = "rise-shine-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Install event
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// === Notification Handling ===
self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes("app.lumemeduck.xyz") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("https://app.lumemeduck.xyz");
      }
    })
  );
});

// Register periodic sync
self.addEventListener("periodicsync", event => {
  if (event.tag === "rise-shine-reminder") {
    event.waitUntil(sendDailyReminders());
  }
});

// Fallback
self.addEventListener("sync", event => {
  if (event.tag === "rise-shine-reminder") {
    event.waitUntil(sendDailyReminders());
  }
});

// Trigger notifications
async function sendDailyReminders() {
  const now = new Date();
  const hour = now.getHours();

  // Fires
  if (hour === 9) {
    showNotification("Rise & Shine 🌞", "your today's motivation is ready!");
  }
  if (hour === 15) {
    showNotification("Don't break your streak ⚡", "your daily challenge is waiting for you!");
  }
  if (hour === 21) {
    showNotification("Rise & Shine 💕", "Have you seen today's quote?");
  }
}

function showNotification(title, body) {
  self.registration.showNotification(title, {
    body,
    icon: "icons/icon-192.png",
    badge: "icons/icon-192.png"
  });
}
