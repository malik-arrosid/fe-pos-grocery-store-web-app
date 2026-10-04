/* eslint-env serviceworker */
/* eslint-disable no-undef */

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js",
);

const resolveFirebaseConfig = () => {
  const params = new URL(self.location.href).searchParams;
  return {
    apiKey: (params.get("apiKey") || "").trim(),
    authDomain: (params.get("authDomain") || "").trim(),
    projectId: (params.get("projectId") || "").trim(),
    storageBucket: (params.get("storageBucket") || "").trim(),
    messagingSenderId: (params.get("messagingSenderId") || "").trim(),
    appId: (params.get("appId") || "").trim(),
  };
};

const firebaseConfig = resolveFirebaseConfig();
const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

if (!hasFirebaseConfig) {
  console.error(
    "Konfigurasi Firebase pada service worker tidak lengkap. FCM web push dinonaktifkan.",
  );
} else {
  firebase.initializeApp(firebaseConfig);

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
}

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