import type { MetadataRoute } from "next";

// Web App Manifest — permite instalar a app no ecrã inicial (PWA).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Servos Fiéis — Recursos para a pregação",
    short_name: "Servos Fiéis",
    description:
      "Plataforma do ministério Servos Fiéis: sermões, recursos e fórum para pregadores.",
    start_url: "/sermoes",
    display: "standalone",
    background_color: "#f7f2ea",
    theme_color: "#586f4f",
    lang: "pt-PT",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
