/**
 * Root layout component for the application.
 * 
 * Provides the base HTML structure with global font classes and a container for child components.
 * Applies Geist Sans and Geist Mono fonts, enables antialiasing, and wraps children in a relative, z-indexed div.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered within the root layout
 * @returns {React.ReactElement} Root HTML layout with applied styles and child components
 */

"use client"; // Enables interactivity

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="relative z-10 p-8">{children}</div>
      </body>
    </html>
  );
}