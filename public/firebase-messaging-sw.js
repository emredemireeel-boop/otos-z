/* OtoSöz Firebase Cloud Messaging service worker */
importScripts("https://www.gstatic.com/firebasejs/12.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.8.0/firebase-messaging-compat.js");

const params = new URL(self.location.href).searchParams;
firebase.initializeApp({
  apiKey: params.get("apiKey"),
  authDomain: params.get("authDomain"),
  projectId: params.get("projectId"),
  storageBucket: params.get("storageBucket"),
  messagingSenderId: params.get("messagingSenderId"),
  appId: params.get("appId"),
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || payload.data?.title || "OtoSöz";
  const options = {
    body: payload.notification?.body || payload.data?.body || "Yeni bildiriminiz var.",
    icon: "/otoasfaltlogo.png",
    badge: "/otoasfaltlogo.png",
    tag: payload.data?.tag || "otosoz-notification",
    data: { link: payload.data?.link || "/" },
  };
  return self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL(event.notification.data?.link || "/", self.location.origin).href;
  event.waitUntil(clients.matchAll({ type:"window", includeUncontrolled:true }).then(items => {
    const existing = items.find(client => client.url.startsWith(self.location.origin));
    if (existing) { existing.navigate(target); return existing.focus(); }
    return clients.openWindow(target);
  }));
});
