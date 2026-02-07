'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalInfo } from '@/app/data/content';

export default function HeroSection() {
  const [activeSkill, setActiveSkill] = useState(0);
  const skills = useMemo(() => personalInfo.skills, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSkill((prev) => (prev + 1) % skills.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [skills.length]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center"
      >
        {/* Glassmorphism Card */}
        <div className="rounded-2xl bg-dark-900/75 p-8 shadow-2xl backdrop-blur-md border border-primary-500/20 md:p-12">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-4 text-5xl font-bold md:text-7xl text-white [text-shadow:_0_0_30px_rgb(96_165_250_/_50%)] dark-reader-mode"
            style={{
              background: 'linear-gradient(to right, #60a5fa, #38bdf8, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {personalInfo.name}
          </motion.h1>

          {/* Subtitle with rotating skills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-6 flex justify-center text-2xl md:text-3xl"
          >
            <div className="relative overflow-hidden" style={{ minWidth: '350px', height: '1.5em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeSkill}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
                  className="absolute inset-0 flex items-center justify-center font-bold text-white [text-shadow:_0_0_20px_rgb(96_165_250_/_40%)] dark-reader-mode"
                  style={{
                    background: 'linear-gradient(to right, #60a5fa, #38bdf8, #22d3ee)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {skills[activeSkill]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-8 text-gray-400"
          >
            Explore my work, projects, and passions in software development.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-5"
          >
            <button
              onClick={() => scrollToSection('about')}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-4 font-semibold text-white shadow-lg shadow-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/50 hover:scale-105"
            >
              <span className="relative z-10">About Me</span>
            </button>
            
            <button
              onClick={() => scrollToSection('projects')}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-secondary-600 to-secondary-500 px-8 py-4 font-semibold text-white shadow-lg shadow-secondary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-secondary-500/50 hover:scale-105"
            >
              <span className="relative z-10">My Projects</span>
            </button>
            
            <button
              onClick={() => scrollToSection('contact')}
              className="group relative overflow-hidden rounded-lg border-2 border-primary-500 bg-dark-800/50 px-8 py-4 font-semibold text-primary-400 transition-all duration-300 hover:bg-primary-500 hover:text-white hover:scale-105"
            >
              <span className="relative z-10">Contact Me</span>
            </button>
            
            <a
              href={process.env.NODE_ENV === 'production' ? '/portfolio-v2/assets/resume.pdf' : '/assets/resume.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-lg border-2 border-accent-400 bg-dark-800/50 px-8 py-4 font-semibold text-accent-400 transition-all duration-300 hover:bg-accent-400 hover:text-white hover:scale-105"
            >
              <span className="relative z-10">Resume</span>
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-primary-400"
        >
          <svg
            className="h-8 w-8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
