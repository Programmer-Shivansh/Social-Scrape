import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Multi-Scraper | Social Media Data Extractor",
  description: "Extract data from Instagram, YouTube, Twitter, and TikTok effortlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${spaceGrotesk.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
