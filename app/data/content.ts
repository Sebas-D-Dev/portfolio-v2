// Centralized content for portfolio
export interface TechStack {
  name: string;
  icon: string;
  url: string;
  category: 'language' | 'framework' | 'tool';
}

export interface Project {
  title: string;
  image: string;
  description: string;
  githubUrl: string;
  liveUrl?: string;
  techStack: string[];
  services: string[];
}

export interface Experience {
  title: string;
  company: string;
  date: string;
  description: string;
  type: 'work';
  technologies: string[];
}

export interface Education {
  title: string;
  institution: string;
  date: string;
  description: string;
  type: 'education';
  technologies: string[];
}

export type TimelineItem = Experience | Education;

// Personal Information
export const personalInfo = {
  name: "Sebastian Torres",
  title: "Full-Stack Developer",
  location: "Boynton Beach, FL",
  email: "sebas.t.nait@gmail.com",
  phone: "+1 (954) 304-7962",
  bio: "I am an aspiring full-stack developer with a passion for building scalable applications using modern technologies. I love working with frameworks like React, Next.js, and Flask, and I always seek to optimize code efficiency and user experience.",
  skills: [
    "Full-Stack Developer",
    "AI & Machine Learning",
    "Python Developer",
    "Database Architect",
    "UI/UX Designer",
    "Data Analytics",
    "IT Systems Support",
  ],
  social: {
    github: "https://github.com/Sebas-D-Dev",
    linkedin: "https://www.linkedin.com/in/sebastian-torres-dev/",
    discord: "https://discord.com/users/your-discord-id", // Update with actual
    instagram: "https://www.instagram.com/your-instagram/", // Update with actual
  },
};

// Tech Stack Data
const getAssetPath = (filename: string) => 
  process.env.NODE_ENV === 'production' ? `/portfolio-v2/assets/${filename}` : `/assets/${filename}`;

export const techLanguages: TechStack[] = [
  { name: "Python", icon: getAssetPath("python.svg"), url: "https://www.python.org/", category: 'language' },
  { name: "JavaScript", icon: getAssetPath("javascript.svg"), url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", category: 'language' },
  { name: "TypeScript", icon: getAssetPath("typescript.svg"), url: "https://www.typescriptlang.org/", category: 'language' },
  { name: "HTML", icon: getAssetPath("html.svg"), url: "https://developer.mozilla.org/en-US/docs/Web/HTML", category: 'language' },
  { name: "CSS", icon: getAssetPath("css.svg"), url: "https://developer.mozilla.org/en-US/docs/Web/CSS", category: 'language' },
  { name: "SQL", icon: getAssetPath("sql.svg"), url: "https://en.wikipedia.org/wiki/SQL", category: 'language' },
  { name: "Java", icon: getAssetPath("java.svg"), url: "https://www.java.com/", category: 'language' },
];

export const techFrameworks: TechStack[] = [
  { name: "MongoDB", icon: getAssetPath("mongodb.svg"), url: "https://www.mongodb.com/", category: 'framework' },
  { name: "React", icon: getAssetPath("react.svg"), url: "https://react.dev/", category: 'framework' },
  { name: "Next.js", icon: getAssetPath("nextjs.svg"), url: "https://nextjs.org/", category: 'framework' },
  { name: "TailwindCSS", icon: getAssetPath("tailwindcss.svg"), url: "https://tailwindcss.com/", category: 'framework' },
  { name: "Firebase", icon: getAssetPath("firebase.svg"), url: "https://firebase.google.com/", category: 'framework' },
  { name: "Node.js", icon: getAssetPath("nodejs.svg"), url: "https://nodejs.org/", category: 'framework' },
  { name: "Flask", icon: getAssetPath("flask.svg"), url: "https://flask.palletsprojects.com/", category: 'framework' },
];

export const allTechStack: TechStack[] = [...techLanguages, ...techFrameworks];

// Projects Data
export const projects: Project[] = [
  {
    title: "Portfolio Website",
    image: getAssetPath("home-page.jpg"),
    description: "A modern, responsive portfolio website built with Next.js featuring interactive elements, smooth animations, and dynamic RSS feeds for tech news.",
    githubUrl: "https://github.com/Sebas-D-Dev/portfolio-v2",
    liveUrl: "https://sebas-d-dev.github.io/portfolio-v2/",
    techStack: ["Next.js", "React", "TypeScript", "TailwindCSS", "Framer Motion"],
    services: ["Github Pages", "Responsive Design", "Animation", "RSS Integration"],
  },
  {
    title: "Stack Inventory",
    image: getAssetPath("stack-inventory.png"),
    description: "AI integrated inventory management system with user roles, permissions, and posting capabilities. Admin capabilities include inventory tracking, order management, and analytics.",
    githubUrl: "https://github.com/Sebas-D-Dev/stack-inventory",
    techStack: ["React", "TypeScript", "Next.js", "Prisma", "PostgreSQL", "TailwindCSS", "Gemini AI"],
    services: ["CRUD Operations", "JWT Authentication", "User Authentication", "AI Integration"],
  },
  {
    title: "Nexus App",
    image: getAssetPath("nexus.jpg"),
    description: "A productivity application for accessing apps, functions, and data seamlessly with a virtual stream deck. Allows users to customize their workflow and access tools quickly with adjustable grids and action buttons.",
    githubUrl: "https://github.com/Sebas-D-Dev/nexus-electron-vite",
    techStack: ["React", "TypeScript", "TailwindCSS", "Electron", "Vite", "Node.js"],
    services: ["Customizable Workflow", "Virtual Stream Deck", "Adjustable Grids"],
  },
  {
    title: "Project Title 4",
    image: getAssetPath("home-page.jpg"),
    description: "Brief description of your fourth project. Explain the problem it solves, key features, and technologies used. Keep it concise and highlight what makes this project unique.",
    githubUrl: "https://github.com/Sebas-D-Dev",
    techStack: ["React", "TypeScript", "Node.js", "MongoDB", "TailwindCSS"],
    services: ["Feature 1", "Feature 2", "Feature 3"],
  },
  {
    title: "Project Title 5",
    image: getAssetPath("home-page.jpg"),
    description: "Brief description of your fifth project. Explain the problem it solves, key features, and technologies used. Keep it concise and highlight what makes this project unique.",
    githubUrl: "https://github.com/Sebas-D-Dev",
    liveUrl: "https://example.com",
    techStack: ["Next.js", "Python", "Flask", "PostgreSQL", "Docker"],
    services: ["Feature 1", "Feature 2", "Feature 3"],
  },
  {
    title: "Project Title 6",
    image: getAssetPath("home-page.jpg"),
    description: "Brief description of your sixth project. Explain the problem it solves, key features, and technologies used. Keep it concise and highlight what makes this project unique.",
    githubUrl: "https://github.com/Sebas-D-Dev",
    techStack: ["Vue.js", "Express", "MySQL", "AWS", "Redis"],
    services: ["Feature 1", "Feature 2", "Feature 3"],
  },
];

// Experience & Education Data
export const experiences: Experience[] = [
  {
    type: 'work',
    title: "Student Affairs IT Intern",
    company: "Florida Atlantic University",
    date: "June 2024 - Present",
    description: "Assisting in the deployment and maintenance of IT systems and devices. Collaborating with the IT team to support student services and improve technology infrastructure.",
    technologies: ["Windows", "Network Administration", "Help Desk", "IT Support", "System Deployment"],
  },
  {
    type: 'work',
    title: "Software Developer Intern",
    company: "Company Name",
    date: "Month Year - Month Year",
    description: "Add your experience description here. Detail your responsibilities, achievements, and the technologies you worked with. Highlight specific projects or contributions that demonstrate your skills.",
    technologies: ["React", "Node.js", "MongoDB", "Git", "Agile"],
  },
];

export const education: Education[] = [
  {
    type: 'education',
    title: "Computer Science - B.A.",
    institution: "Florida Atlantic University",
    date: "August 2023 - May 2026",
    description: "Studying software development, algorithms, and data structures. Learning about web development, mobile app development, and database management.",
    technologies: ["Java", "Python", "C", "C++", "Data Structures", "Algorithms", "SQL", "Linux"],
  },
  {
    type: 'education',
    title: "Artificial Intelligence - Minor",
    institution: "Florida Atlantic University",
    date: "August 2024 - May 2025",
    description: "Studying machine learning algorithms, natural language processing, and computer vision. Participating in AI research projects and programming multilayer neural networks in Python.",
    technologies: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Neural Networks", "NLP", "Computer Vision"],
  },
  {
    type: 'education',
    title: "Global Career Accelerator: Data Analytics",
    institution: "CareerBase",
    date: "August 2025 - December 2025",
    description: "Gain proficiency in data analysis, data visualization, and data-driven decision-making. Completing a capstone project using knowledge of data visualization with R and Python to create a data visualization dashboard in Tableau.",
    technologies: ["R", "Python", "Tableau", "Data Analytics", "Data Visualization", "SQL", "Statistics"],
  },
  {
    type: 'education',
    title: "Certificate/Course Name",
    institution: "Institution Name",
    date: "Month Year - Month Year",
    description: "Add your education or certification details here. Describe what you learned, key projects completed, and skills acquired. Mention any awards, honors, or notable achievements.",
    technologies: ["Technology 1", "Technology 2", "Technology 3", "Technology 4"],
  },
  {
    type: 'education',
    title: "High School Diploma / Previous Degree",
    institution: "School/College Name",
    date: "Month Year - Month Year",
    description: "Add details about your previous educational background. Include relevant coursework, projects, or achievements that are relevant to your career in technology and computer science.",
    technologies: ["Mathematics", "Science", "Programming Fundamentals", "Problem Solving"],
  },
];

// Helper function to parse dates from timeline items
const parseTimelineDate = (dateString: string): number => {
  // Extract the start date from "Month Year - Month Year" or "Month Year - Present"
  const startDate = dateString.split(' - ')[0];
  const date = new Date(startDate);
  return date.getTime();
};

// Combine and sort timeline items (pre-computed for consistency)
export const timelineItems: TimelineItem[] = [...experiences, ...education].sort((a, b) => {
  const dateA = parseTimelineDate(a.date);
  const dateB = parseTimelineDate(b.date);
  const timeDiff = dateB - dateA;
  
  // If dates are equal or invalid, use title for deterministic sorting
  if (timeDiff === 0 || isNaN(timeDiff)) {
    return a.title.localeCompare(b.title);
  }
  return timeDiff;
});
