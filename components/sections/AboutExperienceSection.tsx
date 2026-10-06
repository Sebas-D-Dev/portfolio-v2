'use client';

import { motion } from 'framer-motion';
import { personalInfo, experiences, education, type TimelineItem } from '@/app/data/content';

function ExpandableDetails({ title, children }: { title: string; children: React.ReactNode }) {
  return <details className="timeline-details border-t border-primary-500/20">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-primary-300">
      {title}<span aria-hidden="true" className="details-chevron text-lg">⌄</span>
    </summary>
    <div className="pb-5 text-sm leading-relaxed text-gray-300">{children}</div>
  </details>;
}

function Timeline({ title, items }: { title: string; items: TimelineItem[] }) {
  return <div className="min-w-0">
    <h3 className="mb-7 text-2xl font-semibold text-white">{title}</h3>
    <ol className="timeline-list ml-2 border-l-2 border-primary-500/40">
      {items.map(item => <li key={item.title} className="timeline-item relative pb-7 pl-6 last:pb-0">
        <span aria-hidden="true" className="timeline-dot absolute -left-[7px] top-7 h-3 w-3 rounded-full bg-primary-400 ring-4 ring-dark-950" />
        <article className="min-w-0 rounded-xl border border-primary-500/25 bg-dark-800/60 px-5 pt-5 sm:px-6">
          <p className="mb-2 text-sm font-medium text-primary-300">{item.date}</p>
          <h4 className="mb-2 text-xl font-semibold leading-snug text-white">{item.title}</h4>
          <p className="mb-4 text-sm text-gray-400">{item.type === 'work' ? item.company : item.institution}</p>
          {item.type === 'education' && <p className="mb-5 text-sm leading-relaxed text-gray-300">{item.description}</p>}
          {item.type === 'work' && <ExpandableDetails title="Role details">
            <p className="mb-4">{item.description}</p>
            <div className="flex flex-wrap gap-2">{item.technologies.map(tech => <span key={tech} className="rounded-full border border-primary-500/20 bg-primary-500/10 px-3 py-1 text-xs text-primary-200">{tech}</span>)}</div>
          </ExpandableDetails>}
          {item.type === 'education' && item.details?.map(detail => <ExpandableDetails key={detail.title} title={detail.title}>
            <ul className="list-disc space-y-2 pl-5">{detail.items.map(text => <li key={text}>{text}</li>)}</ul>
          </ExpandableDetails>)}
          {item.type === 'education' && item.technologies.length > 0 && <ExpandableDetails title="Tools & topics">
            <div className="flex flex-wrap gap-2">{item.technologies.map(tech => <span key={tech} className="rounded-full border border-primary-500/20 bg-primary-500/10 px-3 py-1 text-xs text-primary-200">{tech}</span>)}</div>
          </ExpandableDetails>}
        </article>
      </li>)}
    </ol>
  </div>;
}

export default function AboutExperienceSection() {
  return <section id="about" aria-labelledby="about-heading" className="relative bg-dark-950 py-18">
    <div className="container mx-auto max-w-7xl px-6">
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
        <h2 id="about-heading" className="mb-6 text-4xl font-bold text-white md:text-5xl">About Me</h2>
        <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-primary-500 to-accent-400" />
      </motion.div>
      <p className="mx-auto mb-14 max-w-3xl text-center text-lg leading-relaxed text-gray-300">{personalInfo.bio}</p>
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Timeline title="Professional Experience" items={experiences} />
        <Timeline title="Education" items={education} />
      </div>
    </div>
  </section>;
}
