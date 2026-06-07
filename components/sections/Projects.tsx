'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import type { Project } from '@/lib/db/schema'

export default function Projects({ items }: { items: Project[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <SectionWrapper id="projects" title="Projects">
      <div ref={ref} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass rounded-2xl p-6 border-glow hover:glow-cyan-sm transition-all duration-300 flex flex-col"
          >
            {project.featured && (
              <span className="inline-block mb-3 text-xs font-mono text-cyan-neon border border-cyan-neon/30 rounded px-2 py-0.5 w-fit">
                ★ Featured
              </span>
            )}
            <h3 className="text-white font-semibold text-lg mb-2">{project.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {project.techStack?.map(tech => (
                <span
                  key={tech}
                  className="text-xs font-mono text-cyan-dim bg-cyan-neon/5 border border-cyan-neon/20 px-2 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-slate-400 hover:text-cyan-neon border border-slate-700 hover:border-cyan-neon/50 px-3 py-1.5 rounded-md transition-all"
                >
                  GitHub →
                </a>
              )}
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-navy-950 bg-cyan-neon hover:bg-cyan-glow px-3 py-1.5 rounded-md transition-all font-semibold"
                >
                  Live →
                </a>
              )}
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <p className="text-slate-600 font-mono text-sm col-span-3 text-center">No projects added yet.</p>
        )}
      </div>
    </SectionWrapper>
  )
}
