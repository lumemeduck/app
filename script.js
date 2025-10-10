  // Service worker
    window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('SW registered successfully!', reg.scope))
      .catch(err => console.error('SW registration failed!', err));
  }
});

   // Firebase Cloud Messaging
const firebaseConfig = {
  apiKey: "AIzaSyDi1-Qxs-lt8ZNGUm5xW3sAr3QgK38OLI4",
  authDomain: "lmd-quotes-app.firebaseapp.com",
  projectId: "lmd-quotes-app",
  storageBucket: "lmd-quotes-app.firebasestorage.app",
  messagingSenderId: "37451708871",
  appId: "1:37451708871:web:b0876517c898bc7d54c1e2"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
navigator.serviceWorker
  .register("/service-worker.js")
  .then((registration) => {
    console.log("SW ready for Firebase Messaging! ✓");

    return Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        return messaging.getToken({
          vapidKey: "BHDrm0tioscEdrcwKvG50hy2-ZjOkaUtLH3_3obWNpcsGnyG5nf7ccvVrHVz__zoNE4ggnsBqSN1k60GkQunr1w",
          serviceWorkerRegistration: registration
        });
      } else {
        console.warn("Notification permission denied!");
        return null;
      }
    });
  })
  .then((currentToken) => {
    if (currentToken) {
      console.log("FCM Token:", currentToken);
    } else {
      console.warn("No FCM token received. Request permission again?");
    }
  })
  .catch((err) => {
    console.error("Service worker registration or permission failed!", err);
  });

messaging.onMessage((payload) => {
  console.log("Message received in foreground: ", payload);
});
		  
