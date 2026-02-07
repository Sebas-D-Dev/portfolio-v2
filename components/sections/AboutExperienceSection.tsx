'use client';

import { motion } from 'framer-motion';
import { personalInfo, timelineItems } from '@/app/data/content';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutExperienceSection() {
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
          <h2 id="about" className="mb-6 text-4xl font-bold text-white md:text-5xl">
            About Me
          </h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-primary-500 to-accent-400"></div>
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-12 max-w-3xl text-center text-lg text-gray-300 leading-relaxed"
        >
          {personalInfo.bio}
        </motion.p>

        {/* Experience & Education Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative mx-auto max-w-6xl"
        >
          <h3 className="mb-8 text-center text-2xl font-semibold text-white">
            Experience & Education
          </h3>

          {/* Timeline Line - Hidden on mobile */}
          <div className="absolute left-1/2 top-16 hidden h-[calc(100%-4rem)] w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary-500 via-secondary-500 to-accent-400 md:block"></div>

          {/* Timeline Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8"
          >
            {timelineItems.map((item, index) => {
              const isLeft = index % 2 === 0;
              const isWork = item.type === 'work';

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`relative flex flex-col md:flex-row items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                    <div className="group rounded-xl border border-primary-500/20 bg-dark-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary-500 hover:shadow-glow-blue">
                      <h4 className="mb-2 text-xl font-semibold text-white">
                        {item.title}
                      </h4>
                      <p className="mb-2 font-medium text-primary-400">
                        {isWork ? (item as { company: string }).company : (item as { institution: string }).institution}
                      </p>
                      <p className="mb-4 text-sm text-gray-400">{item.date}</p>
                      <p className="mb-4 text-gray-300 leading-relaxed">{item.description}</p>
                      
                      {/* Technologies */}
                      {item.technologies && item.technologies.length > 0 && (
                        <div className="mt-4 border-t border-primary-500/10 pt-4">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Technologies Used
                          </p>
                          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary-500/50 scrollbar-track-dark-700">
                            {item.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="inline-flex items-center rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-300 backdrop-blur-sm transition-all hover:border-primary-400 hover:bg-primary-500/20 hover:text-primary-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Center Dot - Hidden on mobile */}
                  <div className="absolute left-1/2 z-10 hidden h-4 w-4 -translate-x-1/2 rounded-full bg-primary-500 ring-4 ring-dark-950 md:block"></div>

                  {/* Spacer - Hidden on mobile */}
                  <div className="hidden w-5/12 md:block"></div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
