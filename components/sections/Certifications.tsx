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
      <div ref={ref} className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4">
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
            className="snap-start shrink-0 w-[280px] glass rounded-xl p-5 border-glow hover:glow-cyan-sm transition-all duration-300 block"
          >
            {cert.imageUrl && (
              <div className="w-full h-32 -mx-5 -mt-5 mb-3 overflow-hidden rounded-t-xl">
                <img
                  src={cert.imageUrl}
                  alt={cert.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
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
          <p className="text-slate-600 font-mono text-sm w-full text-center">No certifications yet.</p>
        )}
      </div>
    </SectionWrapper>
  )
}
