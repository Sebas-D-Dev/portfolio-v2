"use client"; // Enables interactivity in Next.js

import Navigation from "../../layouts/navigation";
import Image from "next/image";
import "../../styles/about.css";

// List of tech stacks with corresponding icons
const techLanguages = [
  { name: "Python", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/python.svg" : "/assets/python.svg" },
  { name: "JavaScript", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/javascript.svg" : "/assets/javascript.svg" },
  { name: "TypeScript", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/typescript.svg" : "/assets/typescript.svg" },
  { name: "HTML", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/html.svg" : "/assets/html.svg" },
  { name: "CSS", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/css.svg" : "/assets/css.svg" },
  { name: "SQL", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/sql.svg" : "/assets/sql.svg" },
  { name: "Java", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/java.svg" : "/assets/java.svg" },
];
const techStacks = [
  { name: "MongoDB", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/mongodb.svg" : "/assets/mongodb.svg" },
  { name: "React", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/react.svg" : "/assets/react.svg" },
  { name: "Next.js", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/nextjs.svg" : "/assets/nextjs.svg" },
  { name: "TailwindCSS", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/tailwindcss.svg" : "/assets/tailwindcss.svg" },
  { name: "Firebase", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/firebase.svg" : "/assets/firebase.svg" },
  { name: "Node.js", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/nodejs.svg" : "/assets/nodejs.svg" },
  { name: "Flask", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/flask.svg" : "/assets/flask.svg" },
];

export default function About() {
  return (
    <main className="relative">
      {/* Navigation Bar */}
      <Navigation />

      {/* Main About Section */}
      <section className="about-container">
        {/* Title Container */}
        <div className="title-container">
          <h1>About Me</h1>
        </div>

        {/* Description Container */}
        <div className="description-container">
          <p>
            I&apos;m a full-stack developer with a passion for building scalable applications using modern technologies.
            I love working with frameworks like <strong>React, Next.js</strong>, and <strong>MongoDB</strong>, and I always seek to optimize code efficiency and user experience.
          </p>
        </div>

        {/* Tech Stack Scroll Bar Container */}
        <div className="scroll-container">
          <div className="scroll-wrapper animate-scroll-left">
            {techLanguages.map((tech) => (
              <div key={tech.name} className="tech-item gradient-bg">
                <Image src={tech.icon} alt={tech.name} width={50} height={50} />
                <p>{tech.name}</p>
              </div>
            ))}
            {/* Duplicate items for seamless loop */}
            {techLanguages.map((tech) => (
              <div key={`${tech.name}-duplicate`} className="tech-item gradient-bg">
                <Image src={tech.icon} alt={tech.name} width={50} height={50} />
                <p>{tech.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="scroll-container">
          <div className="scroll-wrapper animate-scroll-right">
            {techStacks.map((tech) => (
              <div key={tech.name} className="tech-item gradient-bg">
                <Image src={tech.icon} alt={tech.name} width={50} height={50} />
                <p>{tech.name}</p>
              </div>
            ))}
            {/* Duplicate items for seamless loop */}
            {techStacks.map((tech) => (
              <div key={`${tech.name}-duplicate`} className="tech-item gradient-bg">
                <Image src={tech.icon} alt={tech.name} width={50} height={50} />
                <p>{tech.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}