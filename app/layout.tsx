import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notifything",
  description: "Notification and payment tracking",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Notifything",
  },
};

export const viewport: Viewport = {
  themeColor: "#16181d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: { colorBackground: "#16181d", colorText: "#f2f3f5", colorPrimary: "#7c7cf4" },
      }}
    >
      <html lang="en" className="dark">
        <head>
          <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ServiceWorkerRegistration />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
