'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import type { Certification } from '@/lib/db/schema'

export default function Certifications({ items }: { items: Certification[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <SectionWrapper id="certifications" title="Certifications">
      <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((cert, idx) => (
          <motion.a
            key={cert.id}
            href={cert.link ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-xl p-5 border-glow hover:glow-cyan-sm transition-all duration-300 block"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-white font-medium text-sm leading-snug">{cert.title}</h3>
                <p className="text-cyan-neon font-mono text-xs mt-1">{cert.platform}</p>
              </div>
              <span className="font-mono text-xs text-slate-500 shrink-0">{cert.year}</span>
            </div>
          </motion.a>
        ))}
        {items.length === 0 && (
          <p className="text-slate-600 font-mono text-sm col-span-3 text-center">No certifications yet.</p>
        )}
      </div>
    </SectionWrapper>
  )
}
