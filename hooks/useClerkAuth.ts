"use client";

import { useUser } from "@clerk/nextjs";

export function useClerkAuth() {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded || !isSignedIn || !user) {
    return {
      user: {
        id: "",
        firstName: "",
        lastName: "",
        fullName: "",
        emailAddress: "",
        imageUrl: null as string | null,
      },
      isSignedIn: false as const,
      isLoaded,
    };
  }

  return {
    user: {
      id: user.id,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      fullName: user.fullName ?? "",
      emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
      imageUrl: user.imageUrl ?? null,
    },
    isSignedIn: true as const,
    isLoaded: true as const,
  };
}
