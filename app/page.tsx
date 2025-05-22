"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ParticlesBackground from "@/components/ParticlesBackground";
import "./globals.css";
import "./styles/home.css";

export default function HomePage() {
  const skillSet = ["Artificial Intelligence", "Machine Learning", "Database Management", "Web Development", "UI/UX Design"];
  const [activeSkill, setActiveSkill] = useState(skillSet[0]);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSkill((prev) => {
        const nextIndex = (skillSet.indexOf(prev) + 1) % skillSet.length;
        return skillSet[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [skillSet]);

  return (
    <div className="relative min-h-screen">
      {/* Background Effect & Blur Overlay */}
      <div className="background-container">
        <ParticlesBackground />
        <BlurOverlay />
      </div>

      {/* Main Content Container */}
      <div className="portfolio-container">
        {/* Title Section */}
        <div className="title-section">
          <h1 className="title-heading">Sebastian&apos;s Portfolio</h1>
          <p className="skill-text">
            Working with <span className="skill-highlight">{activeSkill}</span>
          </p>
        </div>

        {/* Description Below Title */}
        <div className="description-text">
          <p>Explore my work, projects, and passions in software development.</p>
        </div>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center relative z-10 p-8">
          {/* Button Container */}
          <div className="button-container">
            {/* About Button */}
            <button
              className="blue-button"
              onClick={() => router.push("/pages/about")}
            >
              About Me
            </button>

            {/* Work Button */}
            <button
              className="purple-button"
              onClick={() => router.push("/pages/work")}
            >
              My Experience
            </button>

            {/* Contact Button */}
            <button
              className="blue-button"
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
              className="purple-button">
                
              Resume
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}

/* BlurOverlay with adjustable blur intensity and opacity */
function BlurOverlay() {
  return (
    <div
      className="blur-overlay"
      aria-hidden="true"
    />
  );
}
