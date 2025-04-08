self.addEventListener("push", function (event) {
  if (event.data) {
    try {
      const data = event.data.json();
      event.waitUntil(
        self.registration.showNotification(data.title, {
          body: data.body,
          icon: data.icon || "/icon512_rounded.png",
          badge: data.badge || "/icon512_rounded.png",
          data: data.data || {
            dateOfArrival: Date.now(),
            primaryKey: "2",
          },
          vibrate: [100, 50, 100],
          actions: data.actions || [],
          tag: data.tag,
        })
      );
    } catch (error) {
      console.error("Error processing push event:", error);
    }
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((windowClients) => {
        // Check if there is already a window open
        for (let client of windowClients) {
          if (client.url === event.notification.data.url && "focus" in client) {
            return client.focus();
          }
        }
        // If no window found, open a new one
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});
