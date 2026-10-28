import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Notifything",
    short_name: "Notifything",
    description: "แจ้งเตือนงานและติดตามการชำระเงิน",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#fbfaf7",
    orientation: "portrait",
    id: "/dashboard",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop.png",
        sizes: "1280x800",
        type: "image/png",
        form_factor: "wide",
        label: "Notifything dashboard on desktop",
      },
      {
        src: "/screenshots/mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Notifything dashboard on mobile",
      },
    ],
  };
}
