"use client"; // Enables interactivity in Next.js

import Navigation from "../../layouts/navigation";
import Image from "next/image";
import "../../styles/about.css";

// List of tech stacks with corresponding icons
const techStacks = [
  { name: "Python", icon: "./python.svg" },
  { name: "JavaScript", icon: "./javascript.svg" },
  { name: "MongoDB", icon: "./mongodb.svg" },
  { name: "React", icon: "./react.svg" },
  { name: "Next.js", icon: "./nextjs.svg" },
  { name: "TailwindCSS", icon: "./tailwindcss.svg" },
  { name: "Firebase", icon: "./firebase.svg" },
  { name: "Node.js", icon: "./nodejs.svg" },
  { name: "Flask", icon: "./flask.svg" },
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
          <div className="scroll-wrapper animate-scroll">
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