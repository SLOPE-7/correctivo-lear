/* Service Worker — Correctivo Lear
   Se encarga de: (1) que la app sea instalable, (2) recibir notificaciones push */

const CACHE_NAME = 'correctivo-lear-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

/* Deja pasar todas las peticiones a la red (la app necesita datos frescos de Supabase) */
self.addEventListener('fetch', event => {
  // No interceptamos nada: siempre red directa.
});

/* ---- Recepción de notificaciones push ---- */
self.addEventListener('push', event => {
  let data = { title: 'Correctivo — Lear', body: 'Tienes una notificación nueva.' };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    if (event.data) data.body = event.data.text();
  }

  const opciones = {
    body: data.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'correctivo',
    renotify: true,
    requireInteraction: true,
    data: { url: data.url || './index.html' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Correctivo — Lear', opciones)
  );
});

/* ---- Al tocar la notificación, abre la app ---- */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const destino = (event.notification.data && event.notification.data.url) || './index.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(listaClientes => {
      for (const cliente of listaClientes) {
        if ('focus' in cliente) return cliente.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(destino);
    })
  );
});
