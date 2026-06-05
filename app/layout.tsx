import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "@/styles/globals.css";

const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Servos Fiéis — Recursos para a pregação",
  description: "Plataforma do ministério Servos Fiéis: sermões, recursos e fórum para pregadores.",
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
