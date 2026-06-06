import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "@/styles/globals.css";

const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const siteName = "Servos Fiéis";
const siteTitle = "Servos Fiéis — Recursos para a pregação";
const siteDescription =
  "Plataforma do ministério Servos Fiéis: sermões, recursos e fórum para pregadores.";

export const metadata: Metadata = {
  metadataBase: new URL("https://projetosermoes.vercel.app"),
  title: siteTitle,
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName,
    type: "website",
    locale: "pt_PT",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
