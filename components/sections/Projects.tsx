'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import type { Project } from '@/lib/db/schema'

export default function Projects({ items }: { items: Project[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <SectionWrapper id="projects" title="Projects">
      <div ref={ref} className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-4">
        {items.map((project, idx) => {
          const isExpanded = expanded[project.id]
          const content = project.points?.length
            ? project.points
            : project.description
              ? [project.description]
              : []
          const truncated = !isExpanded && content.length > 3

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="snap-start shrink-0 w-[340px] lg:w-[380px] glass rounded-2xl p-6 border-glow hover:glow-cyan-sm transition-all duration-300 flex flex-col"
            >
              {project.imageUrl && (
                <div className="relative w-full h-40 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                </div>
              )}
              {project.featured && (
                <span className="inline-block mb-3 text-xs font-mono text-cyan-neon border border-cyan-neon/30 rounded px-2 py-0.5 w-fit">
                  ★ Featured
                </span>
              )}
              <h3 className="text-white font-semibold text-lg mb-2">{project.title}</h3>
              {content.length > 0 && (
                <div className="flex-1 mb-4">
                  {(truncated ? content.slice(0, 3) : content).map((point, i) => (
                    <p key={i} className="text-slate-400 text-sm leading-relaxed flex gap-2 mb-1">
                      <span className="text-cyan-neon mt-0.5 shrink-0">▸</span>
                      <span>{point}</span>
                    </p>
                  ))}
                  {content.length > 3 && (
                    <button
                      onClick={() => toggleExpand(project.id)}
                      className="text-xs font-mono text-indigo-400 hover:text-indigo-300 mt-1 transition-colors"
                    >
                      {isExpanded ? 'Show less ↑' : `Show all ${content.length} points ↓`}
                    </button>
                  )}
                </div>
              )}
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
          )
        })}
        {items.length === 0 && (
          <p className="text-slate-600 font-mono text-sm w-full text-center">No projects added yet.</p>
        )}
      </div>
    </SectionWrapper>
  )
}
