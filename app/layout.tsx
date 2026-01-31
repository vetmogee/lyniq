import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  // Try to fetch logo from database, fallback to static file
  let iconUrl = "/lyniq.svg";
  
  try {
    const logos = await prisma.logo.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    
    if (logos.length > 0) {
      // Use the API route that serves the logo as an image
      iconUrl = "/api/logo/icon";
    }
  } catch (error) {
    // Fallback to static file if database fetch fails
    console.error('Failed to fetch logo for metadata:', error);
  }

  return {
    title: "Nail Salon - Professional Nail Care",
    description: "Modern nail salon with professional services",
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-black`}
      >
        {children}
      </body>
    </html>
  );
}
