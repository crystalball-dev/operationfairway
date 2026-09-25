import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "OP FAIRWAY",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#090a07",
    theme_color: "#090a07",
    icons: [
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
