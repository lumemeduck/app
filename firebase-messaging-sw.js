importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDi1-Qxs-lt8ZNGUm5xW3sAr3QgK38OLI4",
  authDomain: "lmd-quotes-app.firebaseapp.com",
  projectId: "lmd-quotes-app",
  storageBucket: "lmd-quotes-app.firebasestorage.app",
  messagingSenderId: "37451708871",
  appId: "1:37451708871:web:b0876517c898bc7d54c1e2"
});

const messaging = firebase.messaging();

// Background msg
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icons/icon-192.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
