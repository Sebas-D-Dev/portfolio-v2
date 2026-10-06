"use client";

import { MotionConfig } from "framer-motion";
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
  return (
    <MotionConfig reducedMotion="user">
    <div className="relative w-full">
      {/* Fixed Navigation */}
      <Navigation />

      {/* Background Effect for Hero Section Only */}
      <div className="fixed inset-0 z-0 h-screen">
        <ParticlesBackground particleCount={80} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-dark-950/50 to-dark-950"></div>
      </div>

      {/* Main Content - Centered Container */}
      <main id="main-content" className="relative z-10 w-full">
        <div>
          <HeroSection />
        </div>
        <SectionDivider variant="default" />
        <ProjectsSection />
        <SectionDivider variant="dots" />
        <AboutExperienceSection />
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
    </MotionConfig>
  );
}
