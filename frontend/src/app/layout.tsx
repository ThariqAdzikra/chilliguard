import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// Font configurations
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

// Metadata untuk SEO
export const metadata: Metadata = {
  title: "ChiliGuard AI - Deteksi Penyakit Tanaman Cabai",
  description:
    "Aplikasi deteksi penyakit tanaman cabai menggunakan kecerdasan buatan. Akurat, cepat, dan gratis. Lindungi panen cabai Anda dengan teknologi AI.",
  keywords: [
    "deteksi penyakit cabai",
    "AI tanaman",
    "pertanian cerdas",
    "penyakit tanaman",
    "ChiliGuard",
    "smart farming",
  ],
  authors: [{ name: "ChiliGuard Team" }],
  creator: "ChiliGuard AI",
  publisher: "ChiliGuard",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://chilliguard.ai",
    siteName: "ChiliGuard AI",
    title: "ChiliGuard AI - Deteksi Penyakit Tanaman Cabai",
    description:
      "Aplikasi deteksi penyakit tanaman cabai menggunakan kecerdasan buatan. Akurat, cepat, dan gratis.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChiliGuard AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChiliGuard AI - Deteksi Penyakit Tanaman Cabai",
    description:
      "Aplikasi deteksi penyakit tanaman cabai menggunakan kecerdasan buatan.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

// Viewport untuk PWA
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} font-sans antialiased`}
      >
        {/* Background Gradient */}
        <div className="fixed inset-0 gradient-mesh -z-10" />

        {/* Main Content */}
        <main className="relative min-h-screen">{children}</main>

        {/* Toast Notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast: "glass-card",
              title: "font-semibold",
              description: "text-muted-foreground",
            },
          }}
        />
      </body>
    </html>
  );
}
