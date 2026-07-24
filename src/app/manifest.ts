import type { MetadataRoute } from "next";
import { siteConfig } from "../lib/config";

/**
 * Web app manifest for Android / installed web app / home-screen icons.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.projectName,
    short_name: "Roaring Saylor",
    description:
      "Independent cultural meme denominated in tokenized MSTR exposure. We like the stock.",
    start_url: "/",
    display: "standalone",
    background_color: "#070708",
    theme_color: "#070708",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/android-chrome-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/android-chrome-512.png",
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
  };
}
