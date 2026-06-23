'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import type { Skill } from '@/lib/db/schema'

const categoryColors: Record<string, string> = {
  Language: 'border-cyan-neon/40 text-cyan-neon bg-cyan-neon/5',
  Framework: 'border-blue-neon/40 text-blue-neon bg-blue-neon/5',
  Database: 'border-purple-400/40 text-purple-400 bg-purple-400/5',
  Tool: 'border-emerald-400/40 text-emerald-400 bg-emerald-400/5',
  Cloud: 'border-orange-400/40 text-orange-400 bg-orange-400/5',
  Other: 'border-slate-400/40 text-slate-400 bg-slate-400/5'
}

export default function Skills({ items }: { items: Skill[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const grouped = items.reduce((acc, skill) => {
    const cat = skill.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <SectionWrapper id="skills" title="Skills">
      <div ref={ref} className="space-y-10">
        {Object.entries(grouped).map(([category, skills], groupIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: groupIdx * 0.1 }}
          >
            <h3 className="font-mono text-xs text-slate-500 tracking-widest mb-4 uppercase">
              {category}
            </h3>
            <div className="flex overflow-x-auto gap-3 snap-x snap-mandatory pb-2">
              {skills.map((skill, idx) => (
                <motion.span
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: groupIdx * 0.1 + idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className={`snap-start shrink-0 px-4 py-2 rounded-lg border text-sm font-mono transition-all duration-200 cursor-default ${
                    categoryColors[category] ?? categoryColors.Other
                  }`}
                >
                  {skill.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <p className="text-slate-600 font-mono text-sm text-center">No skills added yet.</p>
        )}
      </div>
    </SectionWrapper>
  )
}
