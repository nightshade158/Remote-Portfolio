'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import type { Internship } from '@/lib/db/schema'

export default function Internships({ items }: { items: Internship[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <SectionWrapper id="internships" title="Experience">
      <div ref={ref} className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-neon via-blue-neon to-transparent opacity-30 hidden md:block" />
        <div className="space-y-8 md:pl-12">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative"
            >
              <div className="absolute -left-[3.25rem] top-6 w-3 h-3 rounded-full bg-cyan-neon glow-cyan-sm hidden md:block" />
              <div className="glass rounded-2xl p-6 border-glow hover:glow-cyan-sm transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{item.role}</h3>
                    <p className="text-cyan-neon font-mono text-sm">{item.company}</p>
                  </div>
                  <span className="font-mono text-xs text-slate-500 shrink-0">
                    {item.durationStart} — {item.durationEnd ?? 'Present'}
                  </span>
                </div>
                <ul className="space-y-2">
                  {item.points?.map((point, i) => (
                    <li key={i} className="flex gap-3 text-slate-400 text-sm">
                      <span className="text-cyan-neon mt-0.5 shrink-0">▸</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
          {items.length === 0 && (
            <p className="text-slate-600 font-mono text-sm text-center">No experience entries yet.</p>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
