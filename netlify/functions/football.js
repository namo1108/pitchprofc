const CACHE_NAME = 'pitch-in-v2';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

// 앱에서 보내는 메시지 처리 (알림 표시)
self.addEventListener('message', e => {
  if (e.data?.type === 'show-notification') {
    const { title, body, tag, icon, vibrate } = e.data;
    e.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag,
        vibrate: vibrate || [200, 100, 200],
        renotify: true,
        requireInteraction: false,
        data: { timestamp: Date.now() }
      })
    );
  }
});

// Push 알림 클릭
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({ type: 'notification-click' });
          return;
        }
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
