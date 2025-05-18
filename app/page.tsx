/*
 * Renders the main page of Sebastian's portfolio website.
 * 
 * This component serves as the root page, composing the layout and main content
 * of the portfolio, including a dynamic skill display and background effects.
 * 
 * @returns {React.ReactElement} The rendered page with title, skill rotation, and background
 */

"use client"; // Enables interactivity

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function Page() {
  return (
    <RootLayout>
      <Main />
    </RootLayout>
  );
}

function RootLayout({ children }: { children: React.ReactNode }) {
  const skillSet = ["Artificial Intelligence", "Machine Learning", "Database Management", "Web Development", "UI/UX Design"];
  const [activeSkill, setActiveSkill] = useState(skillSet[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSkill((prev) => {
        const nextIndex = (skillSet.indexOf(prev) + 1) % skillSet.length;
        return skillSet[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  });

  return (
    <html lang="en">
      <body className="antialiased relative">
        {/* Background Effect & Blur Overlay */}
        <div className="absolute inset-0 w-full h-full -z-10">
          <ParticlesBackground />
          <BlurOverlay /> {/* Moved here */}
        </div>

        {/* Main Content Container */}
        <div className="flex flex-col items-center justify-center h-screen text-white">
          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-5xl font-bold">Sebastian&apos;s Portfolio</h1>
            <p className="mt-4 text-2xl font-light opacity-80 transition-opacity duration-1000">
              Working with <span className="font-semibold">{activeSkill}</span>
            </p>
          </div>

          {/* Description Below Title */}
          <div className="mt-6 text-lg text-gray-300 text-center">
            <p>Explore my work, projects, and passions in software development.</p>
          </div>

          {/* Page Content */}
          <div className="relative z-10 p-8">{children}</div>
        </div>
      </body>
    </html>
  );
}

function Main() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center">
      {/* Button Container */}
      <div className="bg-gradient-to-r from-black to-purple-800 rounded-2xl shadow-lg p-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        {/* About Button */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          onClick={() => router.push("/pages/about")}
        >
          About Me
        </button>

        {/* Work Button */}
        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition"
          onClick={() => router.push("/pages/work")}
        >
          My Work
        </button>

        {/* Contact Button */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          onClick={() => router.push("/pages/contact")}
        >
          Contact Me
        </button>

        {/* Resume Button */}
          <a 
            href={
              process.env.NODE_ENV === "production"
                ? "https://sebas-d-dev.github.io/portfolio-v2/assets/resume.pdf"
                : "/assets/resume.pdf"
              }
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition">
              
            Resume
          </a>
      </div>
    </main>
  );
}

/* BlurOverlay with adjustable blur intensity and opacity */
function BlurOverlay() {
  return (
    <div
      className="absolute top-0 left-0 w-full h-full -z-5 bg-gray-300/5 backdrop-blur-sm opacity-60"
      aria-hidden="true"
    />
  );
}