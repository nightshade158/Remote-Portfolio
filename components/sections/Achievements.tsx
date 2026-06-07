'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import type { Achievement } from '@/lib/db/schema'

export default function Achievements({ items }: { items: Achievement[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <SectionWrapper id="achievements" title="Achievements">
      <div ref={ref} className="space-y-4">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="glass rounded-xl p-5 border-glow hover:glow-cyan-sm transition-all duration-300 flex gap-4"
          >
            <span className="text-cyan-neon text-lg shrink-0">🏆</span>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-white font-medium">{item.title}</h3>
                {item.year && (
                  <span className="font-mono text-xs text-slate-500">{item.year}</span>
                )}
              </div>
              {item.description && (
                <p className="text-slate-400 text-sm mt-1">{item.description}</p>
              )}
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <p className="text-slate-600 font-mono text-sm text-center">No achievements yet.</p>
        )}
      </div>
    </SectionWrapper>
  )
}
