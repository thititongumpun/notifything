"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function SubscribeButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if already subscribed
    async function checkSubscription() {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      }
    }

    checkSubscription();
  }, []);

  const handleSubscribe = async () => {
    try {
      // await subscribeToPushNotifications();
      setIsSubscribed(true);
    } catch (error) {
      console.error("Subscription failed:", error);
    }
  };

  return (
    <Button onClick={handleSubscribe} disabled={isSubscribed} variant="outline">
      {isSubscribed ? "Notifications Enabled" : "Enable Notifications"}
    </Button>
  );
}
