import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { basePath, siteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  alternates: { canonical: siteUrl.toString() },
  title: "Sebastian Torres | Full-Stack Developer Portfolio",
  description: "Full-stack developer specializing in React, Next.js, TypeScript, and modern web technologies. View my projects, experience, and latest tech interests.",
  keywords: [
    "Sebastian Torres",
    "Full-Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "Software Engineer",
    "Florida Atlantic University",
  ],
  authors: [{ name: "Sebastian Torres" }],
  creator: "Sebastian Torres",
  publisher: "Sebastian Torres",
  other: {
    'cache-control': 'no-cache, no-store, must-revalidate',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl.toString(),
    title: "Sebastian Torres | Full-Stack Developer Portfolio",
    description: "Full-stack developer specializing in React, Next.js, TypeScript, and modern web technologies.",
    siteName: "Sebastian Torres Portfolio",
    images: [
      {
        url: new URL("assets/projects/portfolio-v2-home.png", siteUrl).toString(),
        width: 1280,
        height: 612,
        alt: "Sebastian Torres Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sebastian Torres | Full-Stack Developer Portfolio",
    description: "Full-stack developer specializing in React, Next.js, TypeScript, and modern web technologies.",
    images: [new URL("assets/projects/portfolio-v2-home.png", siteUrl).toString()],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: `${basePath}/favicon.ico`,
    shortcut: `${basePath}/favicon.ico`,
    apple: `${basePath}/favicon.ico`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
