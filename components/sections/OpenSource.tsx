'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import type { OpenSourceItem } from '@/lib/db/schema'

export default function OpenSource({ items }: { items: OpenSourceItem[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <SectionWrapper id="opensource" title="Open Source">
      <div ref={ref} className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4">
        {items.map((item, idx) => {
          const isExpanded = expanded[item.id]
          const desc = item.description ?? ''
          const needsTrunc = desc.length > 120

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="snap-start shrink-0 w-[320px] glass rounded-xl p-5 border-glow hover:glow-cyan-sm transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-cyan-neon font-mono text-sm font-medium">{item.repoName}</h3>
                {item.year && <span className="text-xs text-slate-500 font-mono">{item.year}</span>}
              </div>
              {desc && (
                <p className="text-slate-400 text-sm mb-4">
                  {needsTrunc && !isExpanded ? desc.slice(0, 120) + '…' : desc}
                  {needsTrunc && (
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="text-indigo-400 hover:text-indigo-300 ml-1 transition-colors"
                    >
                      {isExpanded ? 'less' : 'more'}
                    </button>
                  )}
                </p>
              )}
              <div className="flex gap-3">
                {item.prLink && (
                  <a
                    href={item.prLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-slate-400 hover:text-cyan-neon border border-slate-700 hover:border-cyan-neon/50 px-3 py-1.5 rounded-md transition-all"
                  >
                    View PR →
                  </a>
                )}
                {item.repoUrl && (
                  <a
                    href={item.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-slate-400 hover:text-cyan-neon border border-slate-700 hover:border-cyan-neon/50 px-3 py-1.5 rounded-md transition-all"
                  >
                    Repo →
                  </a>
                )}
              </div>
            </motion.div>
          )
        })}
        {items.length === 0 && (
          <p className="text-slate-600 font-mono text-sm w-full text-center">No open source contributions yet.</p>
        )}
      </div>
    </SectionWrapper>
  )
}
