"use client"; // Enables interactivity in Next.js

import { useEffect, useState } from "react";
import Navigation from "../../layouts/navigation";
import Footer from "../../layouts/footer";
import ScrollButton from "@/components/ScrollButton";
import "../../styles/work.css";

const experiences = [
  { 
    title: "Student Affairs IT Intern",
    company: "Florida Atlantic University",
    date: "June 2024 - Present",
    description: "Assisting in the deployment and maintenance of IT systems and devices. Collaborating with the IT team to support student services and improve technology infrastructure."
  },

  { 
    title: "Global Career Accelerator: Data Analytics",
    institution: "CareerBase",
    date: "August 2025 - December 2025",
    description: "Gain proficiency in data analysis, data visualization, and data-driven decision-making. Will be completing a capstone project using my knowledge of data visualization with R and Python to create a data visualization dashboard in Tableau."
  },
];

const education = [
  { 
    title: "Computer Science - B.A.",
    institution: "Florida Atlantic University",
    date: "August 2023 - May 2026",
    description: "Studying software development, algorithms, and data structures. Learning about web development, mobile app development, and database management."
  },

  { title: "Artificial Intelligence - Minor",
    institution: "Florida Atlantic University",
    date: "August 2024 - May 2025",
    description: "Studying machine learning algorithms, natural language processing, and computer vision. Participating in AI research projects and programming multilayer neural networks in Python."
  },
];

const TimelineItem = ({ 
  title, 
  subtitle, 
  date, 
  description,
  side, 
  isVisible 
}: { 
  title: string; 
  subtitle: string; 
  date: string;
  description: string;
  side: "left" | "right";
  isVisible: boolean;
}) => (
  <div className={`timeline-item ${side} ${isVisible ? 'visible' : ''}`}>
    <div className="timeline-content">
      <h3 className="timeline-title">{title}</h3>
      <p className="timeline-subtitle">{subtitle}</p>
      <span className="timeline-date">{date}</span>
      <p className="timeline-description">{description}</p>
    </div>
  </div>
);

export default function Work() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    // Stagger the fade-in effect for timeline items
    const totalItems = experiences.length + education.length;
    const timer = setTimeout(() => {
      const newVisibleItems = [];
      for (let i = 0; i < totalItems; i++) {
        newVisibleItems.push(i);
        setVisibleItems(newVisibleItems);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Combine experiences and education into a single timeline
  const timelineItems = [];
  const maxItems = Math.max(experiences.length, education.length);
  
  for (let i = 0; i < maxItems; i++) {
    // Add work experience (left side)
    if (i < experiences.length) {
      timelineItems.push({
        type: 'work',
        data: experiences[i],
        index: i * 2
      });
    }
    
    // Add education (right side)
    if (i < education.length) {
      timelineItems.push({
        type: 'education',
        data: education[i],
        index: i * 2 + 1
      });
    }
  }

  // Sort by date (most recent first)
  timelineItems.sort((a, b) => a.index - b.index);

  return (
    <main className="relative" id="top">
      <Navigation />

      {/* Single Timeline Section */}
      <section className="timeline-container">
        <div className="timeline-center-line"></div>
        
        {/* Add the animated line */}
        <div className="line"></div>
        
        <div className="timeline-content-wrapper">
          {timelineItems.map((item, index) => {
            if (item.type === 'work') {
              const workData = item.data as { title: string; company: string; date: string; description: string };
              return (
                <TimelineItem 
                  key={`work-${index}`} 
                  title={workData.title} 
                  subtitle={workData.company} 
                  date={workData.date}
                  description={workData.description}
                  side="left"
                  isVisible={visibleItems.includes(item.index)}
                />
              );
            } else {
              const eduData = item.data as { title: string; institution: string; date: string; description: string };
              return (
                <TimelineItem 
                  key={`edu-${index}`} 
                  title={eduData.title} 
                  subtitle={eduData.institution} 
                  date={eduData.date}
                  description={eduData.description}
                  side="right"
                  isVisible={visibleItems.includes(item.index)}
                />
              );
            }
          })}        
        </div>
      </section>

      <div className="scroll-button-container">
        <ScrollButton
          targetId="top"
          direction="up"
          buttonText="Back to Top"
          className="scroll-button"
        />
      </div>

      <Footer />
    </main>
  );
}
