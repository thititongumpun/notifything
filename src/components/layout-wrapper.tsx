"use client";

import type React from "react";

import { useAuth } from "@clerk/nextjs";
import Header from "@/components/header";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <>
      {isLoaded && isSignedIn && <Header />}
      <main>{children}</main>
    </>
  );
}
