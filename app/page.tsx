"use client";

import { useRef, useEffect, useState } from "react";
import ParticlesBackground from "@/components/ParticlesBackground";
import SectionDivider from "@/components/SectionDivider";
import HeroSection from "@/components/sections/HeroSection";
import AboutExperienceSection from "@/components/sections/AboutExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import NewsInterestsSection from "@/components/sections/NewsInterestsSection";
import ContactSection from "@/components/sections/ContactSection";
import Navigation from "./layouts/navigation";
import Footer from "./layouts/footer";
import ScrollButton from "@/components/ScrollButton";

export default function HomePage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      if (cardRef.current) {
        setCardRect(cardRef.current.getBoundingClientRect());
      }
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  return (
    <div className="relative w-full">
      {/* Fixed Navigation */}
      <Navigation />

      {/* Background Effect for Hero Section Only */}
      <div className="fixed inset-0 z-0 h-screen">
        <ParticlesBackground cardRect={cardRect} particleCount={100} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-dark-950/50 to-dark-950"></div>
      </div>

      {/* Main Content - Centered Container */}
      <main className="relative z-10 w-full">
        <div ref={cardRef}>
          <HeroSection />
        </div>
        <SectionDivider variant="default" />
        <AboutExperienceSection />
        <SectionDivider variant="dots" />
        <ProjectsSection />
        <SectionDivider variant="wave" />
        <NewsInterestsSection />
        <SectionDivider variant="default" />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll Button */}
      <ScrollButton direction="up" />
    </div>
  );
}
