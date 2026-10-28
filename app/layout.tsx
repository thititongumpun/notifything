import type { Metadata, Viewport } from "next";
import { Kanit, Anuphan, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  weight: ["500", "600", "700"],
  subsets: ["thai", "latin"],
});

const anuphan = Anuphan({
  variable: "--font-anuphan",
  weight: ["400", "500", "600"],
  subsets: ["thai", "latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notifything",
  description: "แจ้งเตือนงานและติดตามการชำระเงิน",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Notifything",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  // ponytail: cover + top/bottom insets only. Ceiling: landscape notch (left/right
  // insets) is unhandled; upgrade = px-[env(safe-area-inset-left)] on TopBar + MobileNav.
  viewportFit: "cover",
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
        variables: { colorBackground: "#ffffff", colorText: "#13161b", colorPrimary: "#13161b" },
      }}
    >
      <html lang="th" className={`${kanit.variable} ${anuphan.variable} ${jetbrainsMono.variable}`}>
        <head>
          <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        </head>
        <body className="antialiased">
          <ServiceWorkerRegistration />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
