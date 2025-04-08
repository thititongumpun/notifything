import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'notifything',
    short_name: 'notifything',
    description: 'Notify Your thing with me',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#79b3ff',
    icons: [
      {
        purpose: "maskable",
        sizes: "512x512",
        src: "icon512_maskable.png",
        type: "image/png"
      }, {
        purpose: "any",
        sizes: "512x512",
        src: "icon512_rounded.png",
        type: "image/png"
      }
    ],
  }
}