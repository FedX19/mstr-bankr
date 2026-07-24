import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL(
    siteConfig.officialWebsite ?? "https://mstr-bankr.vercel.app",
  ),
  title: `${siteConfig.projectName} — ${siteConfig.tagline}`,
  description,
  icons: {
    icon: siteConfig.brand.tokenIcon,
    apple: siteConfig.brand.tokenIcon,
  },
  openGraph: {
    title: `${siteConfig.projectName} — ${siteConfig.tagline}`,
    description:
      "A Bitcoin treasury meme, denominated in MSTR. Stock-paired cultural market. Not affiliated with Strategy, Michael Saylor, Keith Gill, Robinhood or Bankr.",
    type: "website",
    images: [
      {
        url: siteConfig.brand.hero,
        width: 1672,
        height: 941,
        alt: siteConfig.brand.heroAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.projectName} — ${siteConfig.tagline}`,
    description:
      "Independent cultural meme denominated in tokenized MSTR exposure. Prelaunch — verify contracts before trading.",
    images: [siteConfig.brand.hero],
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
      <body className="flex min-h-full flex-col bg-[var(--bg)] text-[var(--text)]">
        {children}
      </body>
    </html>
  );
}
