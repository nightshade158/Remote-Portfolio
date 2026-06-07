'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import type { Profile } from '@/lib/db/schema'

export default function About({ profile }: { profile: Profile | null }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <SectionWrapper id="about" title="About Me">
      <div ref={ref} className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <p className="text-slate-300 text-lg leading-relaxed">
            {profile?.about ?? 'Your about text will appear here once added from the dashboard.'}
          </p>
          <div className="flex flex-wrap gap-3">
            {profile?.city && (
              <span className="glass px-4 py-2 rounded-full text-sm text-cyan-neon font-mono border-glow">
                📍 {profile.city}
              </span>
            )}
            {profile?.email && (
              <span className="glass px-4 py-2 rounded-full text-sm text-slate-300 font-mono border-glow">
                ✉️ {profile.email}
              </span>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-2xl p-8 border-glow"
        >
          {profile?.avatarUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={profile.avatarUrl}
                alt={profile?.name ?? 'Profile photo'}
                className="w-40 h-40 rounded-full object-cover border-2 border-cyan-neon/30 shadow-lg shadow-cyan-neon/10"
              />
            </div>
          )}
          <h3 className="font-mono text-cyan-neon text-sm mb-6 tracking-widest">QUICK INFO</h3>
          <div className="space-y-4">
            {[
              { label: 'Status', value: 'Open to opportunities' },
              { label: 'Focus', value: 'Computer Science Engineering' },
              { label: 'Location', value: profile?.city ?? 'India' },
              { label: 'Available', value: 'Full-time / Internship' }
            ].map(item => (
              <div key={item.label} className="flex justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-500 text-sm font-mono">{item.label}</span>
                <span className="text-slate-300 text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
