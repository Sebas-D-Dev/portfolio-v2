'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { projects } from '@/app/data/content';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export default function ProjectsSection() {
  return (
    <section className="relative bg-dark-950 py-18">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 id="projects" className="mb-6 text-4xl font-bold text-white md:text-5xl">
            My Projects
          </h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-primary-500 to-accent-400"></div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-primary-500/20 bg-dark-800/50 backdrop-blur-sm transition-all duration-300 hover:border-primary-500 hover:shadow-glow-blue"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent"></div>
              </div>

              {/* Project Content */}
              <div className="flex flex-1 flex-col p-8">
                <h3 className="mb-3 text-xl font-bold text-white">
                  {project.title}
                </h3>
                <p className="mb-4 text-sm text-gray-400 flex-grow">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.techStack.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-primary-500/20 px-3 py-1 text-xs font-medium text-primary-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="rounded-full bg-primary-500/20 px-3 py-1 text-xs font-medium text-primary-300">
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-4 mt-auto">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/50 hover:scale-105"
                  >
                    GitHub
                  </a>
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-lg border-2 border-primary-500 bg-dark-800/50 py-3 text-center text-sm font-semibold text-primary-400 transition-all duration-300 hover:bg-primary-500 hover:text-white hover:scale-105"
                    >
                      Live Demo
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex-1 rounded-lg border-2 border-gray-600 bg-dark-800/30 py-3 text-center text-sm font-semibold text-gray-500 cursor-not-allowed opacity-50"
                    >
                      Live Demo
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
