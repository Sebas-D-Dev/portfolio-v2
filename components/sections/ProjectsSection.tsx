'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight, Code2, FolderTree, LayoutGrid } from 'lucide-react';
import { projects, type Project } from '@/app/data/content';

const usesWideFeature = (project: Project, featured: boolean) =>
  featured && Boolean(project.imageWidth && project.imageHeight && project.imageWidth / project.imageHeight > 1.9);

function ProjectVisual({ project, featured }: { project: Project; featured: boolean }) {
  return (
    <figure className="flex min-w-0 flex-col bg-dark-900">
      <div
        className={`relative overflow-hidden bg-dark-900 ${featured && !usesWideFeature(project, featured) ? 'lg:flex-1 lg:min-h-80' : ''}`}
        style={{ aspectRatio: project.imageWidth && project.imageHeight ? `${project.imageWidth} / ${project.imageHeight}` : '16 / 10' }}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.imageAlt ?? project.title}
            fill
            sizes={usesWideFeature(project, featured) ? '(min-width: 1280px) 1232px, 100vw' : featured ? '(min-width: 1024px) 55vw, 100vw' : '(min-width: 768px) 50vw, 100vw'}
            className={`${project.id === 'stack-inventory' ? 'object-contain p-10 bg-dark-900' : 'object-contain'} transition-transform duration-500 ${project.id === '3d-portfolio' ? '' : 'motion-safe:group-hover:scale-[1.03]'}`}
          />
        ) : (
          <div aria-hidden="true" className="flex h-full flex-col items-center justify-center gap-5 bg-gradient-to-br from-primary-900/60 via-dark-900 to-secondary-900/40 p-8">
            {project.visual === 'directory' ? <FolderTree size={76} strokeWidth={1} className="text-accent-400" /> : <LayoutGrid size={76} strokeWidth={1} className="text-primary-400" />}
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">{project.category}</span>
          </div>
        )}
      </div>
      <figcaption className="bg-dark-950/90 px-4 py-2 text-xs text-gray-200">
        {project.imageLabel}
      </figcaption>
    </figure>
  );
}

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.article
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35 }}
      className={`group min-w-0 overflow-hidden rounded-2xl border border-primary-500/20 bg-dark-800/40 transition-colors hover:border-primary-400/60 ${featured && project.image && !usesWideFeature(project, featured) ? 'grid lg:grid-cols-[1.2fr_1fr]' : 'flex flex-col'}`}
      aria-labelledby={`project-${project.id}`}
    >
      {(project.image || project.visual) && <ProjectVisual project={project} featured={featured} />}
      <div className="flex min-w-0 flex-1 flex-col p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-primary-400/30 bg-primary-500/10 px-3 py-1 font-medium text-primary-200">{project.status}</span>
          <span className="text-gray-400">{project.category}</span>
        </div>
        <h3 id={`project-${project.id}`} className={`mb-3 font-bold leading-tight text-white ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>
          {project.title}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-gray-300 sm:text-base">{project.description}</p>
        <ul aria-label="Technologies and focus" className="mb-6 flex flex-wrap gap-2">
          {project.techStack.map((tech) => <li key={tech} className="rounded-md bg-primary-500/10 px-2.5 py-1 text-xs text-primary-200">{tech}</li>)}
        </ul>
        {(project.image || project.githubUrl || project.liveUrl) && <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-primary-500/15 pt-5 text-sm font-semibold">
          {project.image && (
            <a href={project.image} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary-300 hover:text-white" aria-label={`View ${project.title} ${project.id === 'stack-inventory' ? 'logo' : 'screenshot'} (opens in a new tab)`}>
              View {project.id === 'stack-inventory' ? 'logo' : 'screenshot'} <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gray-200 hover:text-primary-300" aria-label={`Explore ${project.title} code (opens in a new tab)`}>
              <Code2 size={16} aria-hidden="true" /> Explore code
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary-300 hover:text-white" aria-label={`${project.liveLabel} for ${project.title} (opens in a new tab)`}>
              {project.liveLabel} <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>}
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  const [featured, ...otherProjects] = projects;
  return (
    <section id="projects" aria-labelledby="projects-heading" className="relative bg-dark-950 py-18">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Apps, tools & interactive worlds</p>
          <h2 id="projects-heading" className="mb-6 text-4xl font-bold text-white md:text-5xl">Personal Projects</h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-primary-500 to-accent-400" />
          <p className="mx-auto mt-6 max-w-2xl text-gray-400">A collection of working applications, early prototypes, and ideas I&apos;m still exploring.</p>
        </div>
        <ProjectCard project={featured} featured />
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {otherProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </div>
    </section>
  );
}
