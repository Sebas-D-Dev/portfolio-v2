"use client"; // Enables interactivity in Next.js

import Navigation from "../../layouts/navigation";
import Footer from "../../layouts/footer";
import ScrollButton from "@/components/ScrollButton";
import Image from "next/image";
import "../../styles/about.css";

// List of tech stacks with corresponding icons
const techLanguages = [
  { name: "Python", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/python.svg" : "/assets/python.svg", url: "https://www.python.org/" },
  { name: "JavaScript", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/javascript.svg" : "/assets/javascript.svg", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { name: "TypeScript", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/typescript.svg" : "/assets/typescript.svg", url: "https://www.typescriptlang.org/" },
  { name: "HTML", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/html.svg" : "/assets/html.svg", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { name: "CSS", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/css.svg" : "/assets/css.svg", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { name: "SQL", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/sql.svg" : "/assets/sql.svg", url: "https://en.wikipedia.org/wiki/SQL" },
  { name: "Java", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/java.svg" : "/assets/java.svg", url: "https://www.java.com/" },
];
const techStacks = [
  { name: "MongoDB", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/mongodb.svg" : "/assets/mongodb.svg", url: "https://www.mongodb.com/" },
  { name: "React", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/react.svg" : "/assets/react.svg", url: "https://react.dev/" },
  { name: "Next.js", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/nextjs.svg" : "/assets/nextjs.svg", url: "https://nextjs.org/" },
  { name: "TailwindCSS", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/tailwindcss.svg" : "/assets/tailwindcss.svg", url: "https://tailwindcss.com/" },
  { name: "Firebase", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/firebase.svg" : "/assets/firebase.svg", url: "https://firebase.google.com/" },
  { name: "Node.js", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/nodejs.svg" : "/assets/nodejs.svg", url: "https://nodejs.org/" },
  { name: "Flask", icon: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/flask.svg" : "/assets/flask.svg", url: "https://flask.palletsprojects.com/" },
];

// List of projects
const projects = [
  {
    title: "Portfolio Website",
    image: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/home-page.jpg" : "/assets/home-page.jpg",
    description: "A modern, responsive portfolio website built with Next.js featuring interactive elements and smooth animations.",
    githubUrl: "https://github.com/Sebas-D-Dev/portfolio-v2",
    techStack: ["Next.js", "React", "TypeScript", "TailwindCSS"],
    services: ["Github Pages", "Responsive Design", "Animation"]
  },
  {
    title: "E-Commerce Platform",
    image: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/ecommerce-preview.jpg" : "/assets/ecommerce-preview.jpg",
    description: "Full-featured e-commerce platform with product catalog, shopping cart, and secure checkout functionality.",
    githubUrl: "https://github.com/username/ecommerce-project",
    techStack: ["React", "Node.js", "MongoDB", "Express"],
    services: ["REST API", "Payment Gateway", "User Authentication"]
  },
  {
    title: "Task Management App",
    image: process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/task-app-preview.jpg" : "/assets/task-app-preview.jpg",
    description: "A productivity application for managing tasks, projects and deadlines with collaborative features.",
    githubUrl: "https://github.com/username/task-management",
    techStack: ["React", "Firebase", "Material UI"],
    services: ["Cloud Functions", "Real-time Database", "Authentication"]
  }
];

export default function About() {
  return (
    <main className="relative" id="top">
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
            I am an aspiring full-stack developer with a passion for building scalable applications using modern technologies.
            I love working with frameworks like <strong>React, Next.js</strong>, and <strong>Flask</strong>, and I always seek to optimize code efficiency and user experience.
          </p>
        </div>

        {/* Tech Stack Scroll Bar Container */}
        <div className="scroll-container">
          <div className="scroll-wrapper animate-scroll-left">
            {techLanguages.map((tech) => (
              <a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tech-link"
                tabIndex={0}
              >
                <div className="tech-item gradient-bg">
                  <Image src={tech.icon} alt={tech.name} width={50} height={50} />
                  <p>{tech.name}</p>
                </div>
              </a>
            ))}
            {/* Duplicate items for seamless loop */}
            {techLanguages.map((tech) => (
              <a
                key={`${tech.name}-duplicate`}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tech-link"
                tabIndex={0}
              >
                <div className="tech-item gradient-bg">
                  <Image src={tech.icon} alt={tech.name} width={50} height={50} />
                  <p>{tech.name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="scroll-container">
          <div className="scroll-wrapper animate-scroll-right">
            {techStacks.map((tech) => (
              <a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tech-link"
                tabIndex={0}
              >
                <div className="tech-item gradient-bg">
                  <Image src={tech.icon} alt={tech.name} width={50} height={50} />
                  <p>{tech.name}</p>
                </div>
              </a>
            ))}
            {/* Duplicate items for seamless loop */}
            {techStacks.map((tech) => (
              <a
                key={`${tech.name}-duplicate`}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tech-link"
                tabIndex={0}
              >
                <div className="tech-item gradient-bg">
                  <Image src={tech.icon} alt={tech.name} width={50} height={50} />
                  <p>{tech.name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <ScrollButton 
          targetId="projects-section" 
          direction="down" 
          buttonText="View Projects" 
          className="about-scroll-button"
        />
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="projects-title-container" id="projects-section">
          <h2>My Projects</h2>
        </div>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-image-container">
                {project.image ? (
                  <Image src={project.image} alt={project.title} className="project-image" width={500} height={300} />
                ) : (
                  <div className="hosting-logo">
                    <Image src={process.env.NODE_ENV === "production" ? "/portfolio-v2/assets/github-logo.svg" : "/assets/github-logo.svg"} alt="GitHub" width={50} height={50} />
                  </div>
                )}
              </div>
              
              <div className="project-content">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <a href={project.githubUrl} className="github-link" target="_blank" rel="noopener noreferrer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-tech-stack">
                  {project.techStack.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-services">
                  {project.services.map((service, serviceIndex) => (
                    <span key={serviceIndex} className="service-tag">{service}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}