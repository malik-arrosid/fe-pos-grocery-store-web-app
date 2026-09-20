/* eslint-env serviceworker */
/* eslint-disable no-undef */

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js",
);

// Service worker tidak bisa akses import.meta.env, jadi config di-hardcode di sini.
// Nilai harus SAMA PERSIS dengan .env VITE_FIREBASE_* di atas.
firebase.initializeApp({
  apiKey: "AIzaSyD-HKQO9TZcWCSjF4pqmgaDxkWykx9YOdA",
  authDomain: "pos-grocery-store-web-app.firebaseapp.com",
  projectId: "pos-grocery-store-web-app",
  storageBucket: "pos-grocery-store-web-app.firebasestorage.app",
  messagingSenderId: "21230805158",
  appId: "1:21230805158:web:330594d39a93750a9dd467",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  const data = payload.data || {};

  self.registration.showNotification(title || "PA App Toko Kelontong", {
    body: body || "Ada aktivitas baru pada sistem.",
    icon: "/icon-store.svg",
    badge: "/icon-store.svg",
    data,
    requireInteraction: false,
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const notificationData = event.notification.data || {};
  const targetPath = notificationData.id_notification
    ? `/owner/detail-notifikasi/${notificationData.id_notification}`
    : "/owner/notifikasi";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetPath) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetPath);
        }
      }),
  );
});