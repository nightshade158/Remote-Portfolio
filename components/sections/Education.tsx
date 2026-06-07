'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import type { Education } from '@/lib/db/schema'

export default function EducationSection({ items }: { items: Education[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <SectionWrapper id="education" title="Education">
      <div ref={ref} className="space-y-6">
        {items.map((edu, idx) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass rounded-2xl p-6 border-glow hover:glow-cyan-sm transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h3 className="text-white font-semibold text-lg">{edu.institution}</h3>
                <p className="text-cyan-neon font-mono text-sm mt-1">
                  {edu.degree}{edu.field ? ` — ${edu.field}` : ''}
                </p>
                {edu.description && (
                  <p className="text-slate-400 text-sm mt-2">{edu.description}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="font-mono text-sm text-slate-400">
                  {edu.yearStart} — {edu.yearEnd ?? 'Present'}
                </span>
                {edu.score && (
                  <span className="glass px-3 py-1 rounded-full text-sm font-mono text-cyan-neon border-glow">
                    {edu.scoreType ?? 'Score'}: {edu.score}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <p className="text-slate-600 font-mono text-sm text-center">No education entries yet.</p>
        )}
      </div>
    </SectionWrapper>
  )
}
