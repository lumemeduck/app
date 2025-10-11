const CACHE_NAME = "lmd-quotes-cache-v9";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./trivia/index.html",
  "./sounds/ehuh.mp3",
  "./sounds/buzz.mp3",
  "./sounds/quack.mp3",
  "./icons/icon-512.png",
  "./icons/icon-192.png",
  "./icons/icon-72.png",
  "./icons/icon-150.png"
];

// Install worker
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

  // Try local reminder
  checkAndSendReminders();
});

// Fetch handler
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => response)
      .catch(async () => {
        const cached = await caches.match(event.request);
        return cached || Response.error();
      })
  );
});

// Notification click
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes("app.lumemeduck.xyz") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow("https://app.lumemeduck.xyz");
    })
  );
});

// Push notifications
self.addEventListener("push", event => {
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: "LMD Quotes", body: event.data.text() };
  }

  const title = data.title || "Arise & Shine ☀️";
  const options = {
    body: data.body || "Today's inspirational quote is ready!",
    icon: "icons/icon-192.png",
    badge: "icons/icon-72.png",
    data: data.data || {}
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Background sync
self.addEventListener("periodicsync", event => {
  if (event.tag === "lmd-quotes-reminder") {
    event.waitUntil(checkAndSendReminders());
  }
});

self.addEventListener("sync", event => {
  if (event.tag === "lmd-quotes-reminder") {
    event.waitUntil(checkAndSendReminders());
  }
});

// Message handler
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SCHEDULE_NOTIFICATIONS") {
    startLocalReminderFallback();
  }
});

// Local reminder
async function checkAndSendReminders() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  if (hour === 9 && minute === 0) {
    showNotification("Arise and shine 🌞", "Today's quote is ready, check it out now!");
  }
  if (hour === 15 && minute === 0) {
    showNotification("Don't break your streak ⚡", "Complete today's challenge, it's simple!");
  }
  if (hour === 21 && minute === 0) {
    showNotification("Hello champ 😎", "Have you seen today's quote? Very interesting!");
  }
}

function showNotification(title, body) {
  return self.registration.showNotification(title, {
    body,
    icon: "icons/icon-192.png",
    badge: "icons/icon-72.png"
  });
}

function startLocalReminderFallback() {
  if (self.reminderInterval) clearInterval(self.reminderInterval);

  // Check every minute
  self.reminderInterval = setInterval(() => {
    checkAndSendReminders();
  }, 60 * 1000);
}
