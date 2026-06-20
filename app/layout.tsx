import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
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
  metadataBase: new URL("https://arwani-store.vercel.app"),
  title: "Arwani D'Gabriel Store - Jual Paket Data & Masa Aktif Murah",
  description: "Solusi kebutuhan paket internet (Telkomsel, by.U, Indosat, XL, Axis, Tri, Smartfren) dan perpanjang masa aktif murah, cepat, terpercaya.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    title: "Arwani D'Gabriel Store - Jual Paket Data & Masa Aktif Murah",
    description: "Solusi kebutuhan paket internet dan perpanjang masa aktif murah, cepat, terpercaya.",
    siteName: "Arwani D'Gabriel Store",
    images: [
      {
        url: "/telkomsel.png", // fallback beautiful OG image using pre-existing asset
        width: 512,
        height: 512,
        alt: "Arwani Store Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arwani D'Gabriel Store",
    description: "Paket Data & Masa Aktif Terlengkap & Murah",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-100 dark:bg-slate-950 transition-colors duration-500">
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
