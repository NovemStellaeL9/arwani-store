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
  title: "Arwani Store – Paket Data & Kuota Internet Murah",
  description:
    "Jual paket internet Telkomsel, Indosat, XL, Axis, Tri. Harga murah, proses cepat, konfirmasi via WhatsApp.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Arwani Store",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/telkomsel.png",
  },
  openGraph: {
    type: "website",
    title: "Arwani Store – Paket Data Murah",
    description: "Paket internet murah, cepat, terpercaya. Konfirmasi via WhatsApp.",
    siteName: "Arwani Store",
    images: [{ url: "/telkomsel.png", width: 512, height: 512, alt: "Arwani Store" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arwani Store",
    description: "Paket Data & Masa Aktif Murah",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1628",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Arwani Store" />
      </head>
      <body className="min-h-full bg-[#060e1c]">
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
