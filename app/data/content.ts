import { assetPath } from '@/lib/site';

// Centralized content for portfolio
export interface TechStack {
  name: string;
  icon: string;
  url: string;
  category: 'language' | 'framework' | 'tool';
}

export interface Project {
  title: string;
  id: string;
  image?: string;
  imageAlt?: string;
  imageLabel: string;
  status: string;
  category: string;
  visual?: 'controls' | 'directory';
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  liveLabel?: string;
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
    linkedin: "https://www.linkedin.com/in/sebastian-torres-cs/",
    discord: "https://discord.com/users/1373891287392194620/",
    instagram: "https://www.instagram.com/xsea_bassx/",
  },
};

// Tech Stack Data
const getAssetPath = assetPath;

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
    id: "caverna",
    title: "Caverna D Sebas",
    status: "In progress",
    category: "3D engineering portfolio",
    image: getAssetPath("projects/caverna-earlier-home.png"),
    imageAlt: "Earlier Caverna D Sebas development build, with STRATUM branding, showing a 3D cavern workstation and hardware exhibits.",
    imageLabel: "Earlier development build",
    description: "An interactive portfolio set inside an underground engineering facility. A work-in-progress experiment in exploring projects through a spatial, 3D environment.",
    techStack: ["3D", "Interactive design", "Web development"],
    services: ["Spatial navigation", "Personal portfolio"],
  },
  {
    id: "portfolio",
    title: "portfolio-v2",
    status: "Live · Ongoing",
    category: "Web development",
    image: getAssetPath("home-page.jpg"),
    imageAlt: "The blue-on-dark introduction screen of Sebastian Torres’s web portfolio",
    imageLabel: "Earlier website screenshot",
    description: "My web portfolio for projects, experience, and technology interests. Built with animated sections, an experience timeline, and an RSS-based news reader.",
    githubUrl: "https://github.com/Sebas-D-Dev/portfolio-v2",
    liveUrl: "https://sebas-d-dev.github.io/portfolio-v2/",
    liveLabel: "Visit website",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    services: ["GitHub Pages", "Responsive design", "RSS reader"],
  },
  {
    id: "stack-inventory",
    title: "Stack Inventory",
    status: "Sign-in required",
    category: "Full-stack application",
    image: getAssetPath("projects/stack-inventory-posts.jpg"),
    imageAlt: "The original Stack Inventory posts page showing three article cards.",
    imageLabel: "Original application screenshot",
    description: "An inventory application covering products, vendors, purchasing, role-based views, and analytics, with an experimental Gemini-backed inventory assistant.",
    githubUrl: "https://github.com/Sebas-D-Dev/stack-inventory",
    liveUrl: "https://stack-inventory.vercel.app/",
    liveLabel: "Open app · Sign in",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    services: ["Inventory workflows", "Role-based views", "Experimental AI"],
  },
  {
    id: "nexus",
    title: "Nexus",
    status: "Early prototype",
    category: "Desktop tooling",
    visual: "controls",
    imageLabel: "Concept artwork · Not an app screenshot",
    description: "A customizable on-screen control-surface concept for organizing apps, shortcuts, and workflows. Current work includes a landing-page concept and an Electron application scaffold.",
    githubUrl: "https://github.com/Sebas-D-Dev/nexus-electron-vite",
    techStack: ["Electron", "React", "TypeScript", "Vite"],
    services: ["Control-surface concept", "Desktop exploration"],
  },
  {
    id: "directory-generator",
    title: "Directory Structure Generator",
    status: "Prototype",
    category: "Developer tools",
    visual: "directory",
    imageLabel: "Concept artwork · Not an app screenshot",
    description: "An experiment in planning project directory structures through workspaces. The prototype includes workspace and gallery APIs, plus a Gemini text-generation endpoint.",
    githubUrl: "https://github.com/Sebas-D-Dev/directory-structure-generator",
    techStack: ["Workspaces", "APIs", "Gemini"],
    services: ["Project planning", "Directory structures"],
  },
];

// Experience & Education Data (in reverse chronological order - newest first)
export const experiences: Experience[] = [
  {
    type: 'work',
    title: "Full Stack Python Developer",
    company: "Mr. Sure Thing",
    date: "January 2026 - Present",
    description: "Developing and maintaining a full-stack Python application for a local business. Implementing features, optimizing performance, and ensuring a seamless user experience. Collaborating with stakeholders to understand requirements and deliver solutions that meet business needs.",
    technologies: ["Python", "Node.js", "Next.js", "Git", "Supabase", "MongoDB", "AI Integration", "Web Development", "Database Management"],
  },
  {
    type: 'work',
    title: "Front-End UI/UX Prototyping Intern",
    company: "Local Fiber",
    date: "August 2025 - February 2026",
    description: "Designing and prototyping user interfaces for a fiber internet service provider. Creating responsive web components and implementing modern design patterns using Vite and React. Collaborating with the development team to ensure seamless integration of UI/UX designs into the production environment.",
    technologies: ["React", "TypeScript", "Vite", "TailwindCSS", "Figma", "Git", "Agile", "UI/UX Design"],
  },
  {
    type: 'work',
    title: "Student Affairs IT & Programming Intern",
    company: "Florida Atlantic University",
    date: "June 2024 - February 2026",
    description: "Assisted in the deployment and maintenance of IT systems and devices for student services. Collaborated with the IT team to support technology infrastructure and improve student experience. Gained hands-on experience with web development, database management, and system administration.",
    technologies: ["PHP", "JavaScript", "Web Development", "MSSQL", "IT Support", "System Administration"],
  },
];

export const education: Education[] = [
  {
    type: 'education',
    title: "Bachelor of Arts in Computer Science",
    institution: "Florida Atlantic University",
    date: "August 2023 - May 2026",
    description: "Studying software development, algorithms, and data structures. Learning about web development, mobile app development, database management, and machine learning.",
    technologies: ["Python", "JavaScript", "HTML", "CSS", "MySQL", "MongoDB", "Git", "Swift"],
  },
  {
    type: 'education',
    title: "Minor in Artificial Intelligence & Cybersecurity",
    institution: "Florida Atlantic University",
    date: "August 2024 - May 2026",
    description: "Studying machine learning algorithms, natural language processing, and computer vision. Participating in AI research projects and programming multilayer neural networks in Python. Learning about cybersecurity principles, ethical hacking, and network security.",
    technologies: ["TensorFlow", "PyTorch", "Neural Networks", "NLP", "Computer Vision", "Ethical Hacking", "Network Security"],
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
    title: "High School Diploma",
    institution: "Spanish River Community High School",
    date: "August 2019 - June 2023",
    description: "Graduated with honors. Participated in computer science club and coding competitions. Completed coursework in programming, web development, and data structures.",
    technologies: ["Calculus", "Java", "Programming Fundamentals", "Object-Oriented Programming", "Data Structures"],
  },
];

// Helper function to parse dates from timeline items
const parseTimelineDate = (dateString: string): number => {
  // Extract the start date from "Month Year - Month Year" or "Month Year - Present"
  const startDate = dateString.split(' - ')[0];
  const date = new Date(startDate);
  return date.getTime();
};

// Combine and sort timeline items in chronological order (oldest to newest)
export const timelineItems: TimelineItem[] = [...experiences, ...education].sort((a, b) => {
  const dateA = parseTimelineDate(a.date);
  const dateB = parseTimelineDate(b.date);
  const timeDiff = dateA - dateB; // Changed to dateA - dateB for chronological order
  
  // If dates are equal or invalid, use title for deterministic sorting
  if (timeDiff === 0 || isNaN(timeDiff)) {
    return a.title.localeCompare(b.title);
  }
  return timeDiff;
});
