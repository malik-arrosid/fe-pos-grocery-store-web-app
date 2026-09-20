import { useEffect, useState, useCallback } from "react";
import { getToken, onMessage } from "firebase/messaging";
import Swal from "sweetalert2";
import { getFirebaseMessaging } from "../../lib/firebase/firebaseConfig.js";
import ownerClient from "../../lib/http/ownerClient.js";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export default function useFcmNotification() {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined"
      ? Notification.permission
      : "unsupported",
  );
  const [fcmToken, setFcmToken] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const registerToken = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return null;
    }

    setIsRegistering(true);
    try {
      const swRegistration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );

      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== "granted") {
        return null;
      }

      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        console.warn("FCM tidak didukung di browser ini.");
        return null;
      }

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swRegistration,
      });

      if (!token) return null;

      setFcmToken(token);

      await ownerClient.post("/fcm-tokens/register", {
        fcm_token: token,
        device_info: navigator.userAgent,
      });

      return token;
    } catch (error) {
      console.error("Gagal mendaftarkan FCM token:", error);
      return null;
    } finally {
      setIsRegistering(false);
    }
  }, []);

  const unregisterToken = useCallback(async () => {
    if (!fcmToken) return;
    try {
      await ownerClient.delete("/fcm-tokens/unregister", {
        data: { fcm_token: fcmToken },
      });
    } catch (error) {
      console.error("Gagal menghapus FCM token:", error);
    } finally {
      setFcmToken(null);
    }
  }, [fcmToken]);

  // Auto-register saat hook pertama kali dipakai (dipasang di OwnerRoutes)
  useEffect(() => {
    if (permission === "granted" || permission === "default") {
      registerToken();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listener untuk notifikasi saat tab owner sedang aktif (foreground)
  useEffect(() => {
    let unsubscribe;

    const setupForegroundListener = async () => {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      unsubscribe = onMessage(messaging, (payload) => {
        const { title, body } = payload.notification || {};
        Swal.fire({
          icon: "info",
          title: title || "Notifikasi Baru",
          text: body || "",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
      });
    };

    setupForegroundListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return {
    permission,
    fcmToken,
    isRegistering,
    registerToken,
    unregisterToken,
  };
}