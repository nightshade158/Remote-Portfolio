'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import type { Project } from '@/lib/db/schema'

function getContent(p: Project) {
  return p.points?.length ? p.points : p.description ? [p.description] : []
}

export default function Projects({ items }: { items: Project[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [descModal, setDescModal] = useState<Project | null>(null)
  const [imageModal, setImageModal] = useState<string | null>(null)

  return (
    <SectionWrapper id="projects" title="Projects">
      <div ref={ref} className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-4">
        {items.map((project, idx) => {
          const content = getContent(project)

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="snap-start shrink-0 w-[340px] lg:w-[380px] h-[480px] glass rounded-2xl p-6 border-glow hover:glow-cyan-sm transition-all duration-300 flex flex-col items-center overflow-hidden"
            >
              {project.imageUrl && (
                <div
                  className="w-24 h-24 rounded-full overflow-hidden mb-4 shrink-0 cursor-pointer ring-2 ring-slate-700 hover:ring-cyan-neon/50 transition-all"
                  onClick={() => setImageModal(project.imageUrl!)}
                >
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-white font-semibold text-lg mb-1 text-center">{project.title}</h3>
              {project.year && (
                <p className="text-xs font-mono text-slate-500 mb-3">{project.year}</p>
              )}
              {content.length > 0 && (
                <div
                  className="flex-1 mb-4 w-full cursor-pointer"
                  onClick={() => setDescModal(project)}
                >
                  {content.slice(0, 2).map((point, i) => (
                    <p key={i} className="text-slate-400 text-sm leading-relaxed flex gap-2 mb-1">
                      <span className="text-cyan-neon mt-0.5 shrink-0">▸</span>
                      <span>{point}</span>
                    </p>
                  ))}
                  {content.length > 2 && (
                    <p className="text-xs font-mono text-indigo-400 mt-2 text-center">Click to expand</p>
                  )}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-5 justify-center">
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

      {descModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setDescModal(null)}
        >
          <div
            className="bg-[#12121a] border border-[#27272f] rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-white font-semibold text-lg mb-3">{descModal.title}</h3>
            {getContent(descModal).map((point, i) => (
              <p key={i} className="text-slate-300 text-sm leading-relaxed flex gap-2 mb-2">
                <span className="text-cyan-neon mt-0.5 shrink-0">▸</span>
                <span>{point}</span>
              </p>
            ))}
            <button
              onClick={() => setDescModal(null)}
              className="mt-4 text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {imageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setImageModal(null)}
        >
          <img
            src={imageModal}
            alt="Enlarged"
            className="max-w-[90vw] max-h-[90vh] rounded-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </SectionWrapper>
  )
}
