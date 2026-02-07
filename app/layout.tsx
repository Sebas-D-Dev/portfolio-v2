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
    url: "https://sebas-d-dev.github.io/portfolio-v2/",
    title: "Sebastian Torres | Full-Stack Developer Portfolio",
    description: "Full-stack developer specializing in React, Next.js, TypeScript, and modern web technologies.",
    siteName: "Sebastian Torres Portfolio",
    images: [
      {
        url: "/portfolio-v2/assets/home-page.jpg",
        width: 1200,
        height: 630,
        alt: "Sebastian Torres Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sebastian Torres | Full-Stack Developer Portfolio",
    description: "Full-stack developer specializing in React, Next.js, TypeScript, and modern web technologies.",
    images: ["/portfolio-v2/assets/home-page.jpg"],
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
