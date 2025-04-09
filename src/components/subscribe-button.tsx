"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

type VapidPublicKey = {
  publicKey: string;
};

export default function SubscribeButton({ jobId }: { jobId: string }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    // Check if push notifications are supported
    const checkSupport = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setIsSupported(false);
        return;
      }

      setIsSupported(true);

      // Check if already subscribed
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };

    checkSupport();
  }, []);

  const subscribe = async () => {
    try {
      // Register service worker if not already registered
      const registration = await navigator.serviceWorker.register("/sw.js");

      // Get VAPID public key from server
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription/vapid-public-key`
      );
      const vapidPublicKey: VapidPublicKey = await response.json();

      // Convert the key to the format needed by the browser
      const convertedKey = urlBase64ToUint8Array(vapidPublicKey.publicKey);

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      // Send the subscription to your server
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          jobId,
          userId: user?.id || null,
        }),
      });

      setIsSubscribed(true);
      toast.success("Successfully subscribed to notifications");
    } catch (error) {
      console.error("Subscription failed:", error);
      toast.error("Failed to subscribe to notifications");
    }
  };

  const unsubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe from browser
        await subscription.unsubscribe();

        // Notify server
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscription/unsubscribe`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subscription,
              jobId,
              userId: user?.id,
            }),
          }
        );

        setIsSubscribed(false);
        toast.success("Successfully unsubscribed from notifications");
      }
    } catch (error) {
      console.error("Unsubscribe failed:", error);
      toast.error("Failed to unsubscribe from notifications");
    }
  };

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  if (!isSupported) {
    return (
      <p className="text-sm text-muted-foreground">
        Push notifications are not supported in this browser
      </p>
    );
  }

  return (
    <Button
      variant={isSubscribed ? "outline" : "default"}
      onClick={isSubscribed ? unsubscribe : subscribe}
      className="w-full sm:w-auto"
    >
      {isSubscribed
        ? "Unsubscribe from Notifications"
        : "Subscribe to Notifications"}
    </Button>
  );
}
