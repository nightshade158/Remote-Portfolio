'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { clsx } from 'clsx'

interface SectionWrapperProps {
  id: string
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export default function SectionWrapper({
  id, title, subtitle, children, className
}: SectionWrapperProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id={id} ref={ref} className={clsx('relative py-24 px-6 md:px-12 lg:px-24', className)}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            <span className="text-cyan-neon">&lt;</span>
            {title}
            <span className="text-cyan-neon">/&gt;</span>
          </h2>
          {subtitle && (
            <p className="mt-4 text-slate-400 font-mono text-sm">{subtitle}</p>
          )}
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-neon to-transparent opacity-30" />
        </motion.div>
        {children}
      </div>
    </section>
  )
}
