import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "../lib/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Independent cultural meme whose primary market is denominated in tokenized MSTR exposure. Stock-paired on Robinhood Chain. Prelaunch — no official token is live.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070708" },
    { media: "(prefers-color-scheme: light)", color: "#070708" },
  ],
  viewportFit: "cover",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    siteConfig.officialWebsite ?? "https://mstr-bankr.vercel.app",
  ),
  applicationName: siteConfig.projectName,
  title: `${siteConfig.projectName} — ${siteConfig.tagline}`,
  description,
  // File conventions (app/favicon.ico, icon.png, apple-icon.png) also apply.
  // Explicit icons cover multi-size browser + iOS + Android / web-app install.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
      {
        url: "/icons/android-chrome-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/android-chrome-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/icons/apple-touch-icon.png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.projectName,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: `${siteConfig.projectName} — ${siteConfig.tagline}`,
    description:
      "A Bitcoin treasury meme, denominated in MSTR. Stock-paired cultural market. Not affiliated with Strategy, Michael Saylor, Keith Gill, Robinhood or Bankr.",
    type: "website",
    images: [
      {
        url: siteConfig.brand.ogShare,
        width: 1731,
        height: 909,
        alt: siteConfig.brand.ogShareAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.projectName} — ${siteConfig.tagline}`,
    description:
      "Independent cultural meme denominated in tokenized MSTR exposure. Prelaunch — verify contracts before trading.",
    images: [siteConfig.brand.ogShare],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
        {children}
      </body>
    </html>
  );
}
