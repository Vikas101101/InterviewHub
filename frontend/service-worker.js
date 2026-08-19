const CACHE_NAME = 'interviewhub-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/api.js',
  '/js/app.js',
  '/js/auth.js',
  '/js/interview.js',
  '/js/pages.js',
  '/images/app_logo.jpeg',
  '/images/sessions.jpeg',
  '/images/average_score.jpeg',
  '/images/best_topic.jpeg',
  '/images/streak.jpeg',
  '/images/dashboard.jpeg',
  '/images/sidebar.jpeg',
  '/images/topbar.jpeg',
];

// Install — cache everything
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('InterviewHub: Caching all assets for offline use...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — remove old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('Deleting old cache:', k);
          return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch strategy
self.addEventListener('fetch', e => {

  // API calls — network first, fallback to offline message
  if (e.request.url.includes('/api/')) {
    e.respondWith(
      fetch(e.request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'You are offline. Please connect to internet.' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Static assets — cache first, then network
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(response => {
        // Cache new resources dynamically
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Fallback to index.html for navigation requests
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Push Notifications
self.addEventListener('push', e => {
  const data    = e.data ? e.data.json() : {};
  const title   = data.title || 'InterviewHub';
  const options = {
    body:    data.body    || 'Time to practice your interview skills!',
    icon:    '/images/app_logo.jpeg',
    badge:   '/images/app_logo.jpeg',
    vibrate: [200, 100, 200],
    data:    { url: data.url || '/' }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url));
});