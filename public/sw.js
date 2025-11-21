const CACHE_NAME = 'danzapuntaje-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Lista de recursos estáticos que se cachearán
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/src/main.tsx',
    '/src/App.tsx',
    '/src/index.css',
    '/vite.svg'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// Estrategia de caché: Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorar requests de Chrome Extension y otros orígenes no HTTP
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return;
    }

    // Estrategia para recursos estáticos
    if (request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'image' ||
        request.destination === 'font') {
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    // Si está en caché, devolverlo y actualizar en segundo plano
                    if (cachedResponse) {
                        // Actualizar el caché en segundo plano
                        fetch(request)
                            .then((response) => {
                                if (response.ok) {
                                    caches.open(STATIC_CACHE)
                                        .then((cache) => {
                                            cache.put(request, response.clone());
                                        });
                                }
                            })
                            .catch(() => {
                                console.log('Service Worker: Network request failed, using cache');
                            });
                        return cachedResponse;
                    }

                    // Si no está en caché, intentar fetch y cachear
                    return fetch(request)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }

                            // Clonar la respuesta antes de cachearla
                            const responseClone = response.clone();
                            caches.open(DYNAMIC_CACHE)
                                .then((cache) => {
                                    cache.put(request, responseClone);
                                });

                            return response;
                        })
                        .catch(() => {
                            // Si falla el fetch, intentar servir desde el caché dinámico
                            return caches.match(request);
                        });
                })
        );
        return;
    }

    // Estrategia para navegación (páginas HTML)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    // Cachear la respuesta exitosa
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE)
                        .then((cache) => {
                            cache.put(request, responseClone);
                        });

                    return response;
                })
                .catch(() => {
                    // Si falla el fetch, servir la página index.html desde caché
                    return caches.match('/index.html') || caches.match('/');
                })
        );
        return;
    }

    // Para otros tipos de requests, usar Network First con fallback a caché
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Cachear respuestas exitosas
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                    .then((cache) => {
                        cache.put(request, responseClone);
                    });

                return response;
            })
            .catch(() => {
                // Fallback a caché si el network falla
                return caches.match(request);
            })
    );
});

// Sincronización en segundo plano (para cuando vuelva la conexión)
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Sync event triggered', event.tag);

    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Aquí podríamos sincronizar datos pendientes
            console.log('Service Worker: Background sync completed')
        );
    }
});

// Push notifications (opcional para el futuro)
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push received');

    const options = {
        body: event.data ? event.data.text() : 'Nueva notificación de Danza Puntaje',
        icon: '/vite.svg',
        badge: '/vite.svg'
    };

    event.waitUntil(
        self.registration.showNotification('Danza Puntaje', options)
    );
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification click received');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});
