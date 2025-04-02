"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import React from "react";

export default function BackButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className={className}
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
}
