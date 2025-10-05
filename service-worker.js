const CACHE_NAME = "lmd-quotes-cache-v3";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./trivia/index.html",
  "./icons/icon-72.png",
  "./icons/icon-150.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Update cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Notification Click
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

// Background Sync
self.addEventListener("periodicsync", event => {
  if (event.tag === "lmd-quotes-reminder") {
    event.waitUntil(sendDailyReminders());
  }
});

// Fallback
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SCHEDULE_NOTIFICATIONS") {
    scheduleDailyRemindersFallback();
  }
});

// Notification
async function sendDailyReminders() {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  // Fire
  if (hour === 9 && minutes === 0) {
    showNotification("Arise and shine 🌞", "today's quote is ready, check it out now!");
  }
  if (hour === 15 && minutes === 0) {
    showNotification("Don't break your streak ⚡", "complete today's challenge, it's simple!");
  }
  if (hour === 21 && minutes === 0) {
    showNotification("Hello champ 😎", "have you seen today's quote? very interesting!");
  }
}

function showNotification(title, body) {
  self.registration.showNotification(title, {
    body,
    icon: "icons/icon-192.png",
    badge: "icons/icon-72.png"
  });
}

// Fallback
function scheduleDailyRemindersFallback() {
  if (self.reminderInterval) clearInterval(self.reminderInterval);

  self.reminderInterval = setInterval(() => {
    sendDailyReminders();
  }, 60 * 1000);
    }
