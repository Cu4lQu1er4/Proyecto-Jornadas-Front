import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WorkTime Kiosk",
    short_name: "Kiosk",
    start_url: "/kiosk",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "landscape",
    icons: [
      {
        src: "/icons/kiosk-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/kiosk-512.png",
        sizes: "512x512",
        type: "image/png",
      }
    ]
  };
}