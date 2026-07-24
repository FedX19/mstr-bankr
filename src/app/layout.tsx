import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Roaring Saylor — We like the stock.",
  description:
    "Public dashboard for the Roaring Saylor thesis. Strategy (MSTR) as a Bitcoin accumulation vehicle. Creator fees recycle into tokenized MSTR — transparent, trackable, compounding.",
  openGraph: {
    title: "Roaring Saylor — We like the stock.",
    description:
      "Strategy is a Bitcoin accumulation vehicle. Short interest remains elevated. We recycle volume into the treasury.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roaring Saylor — We like the stock.",
    description:
      "Public MSTR accumulation dashboard. Recycling volume into the treasury.",
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
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)]">
        {children}
      </body>
    </html>
  );
}
