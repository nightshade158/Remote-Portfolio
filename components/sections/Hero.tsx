'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import ParticleField from '@/components/three/ParticleField'
import FloatingGeometry from '@/components/three/FloatingGeometry'
import type { Profile } from '@/lib/db/schema'

export default function Hero({ profile }: { profile: Profile | null }) {
  const titleRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!titleRef.current || !profile?.title) return
    const titles = profile.title.split(',').map(t => t.trim()).filter(Boolean)
    if (titles.length === 0) return
    let currentIndex = 0
    let currentChar = 0
    let isDeleting = false
    let timeoutId: ReturnType<typeof setTimeout>

    const type = () => {
      const current = titles[currentIndex]
      if (!titleRef.current) return
      if (isDeleting) {
        currentChar--
        titleRef.current.textContent = current.substring(0, currentChar)
        if (currentChar === 0) {
          isDeleting = false
          currentIndex = (currentIndex + 1) % titles.length
          timeoutId = setTimeout(type, 500)
        } else {
          timeoutId = setTimeout(type, 50)
        }
      } else {
        currentChar++
        titleRef.current.textContent = current.substring(0, currentChar)
        if (currentChar === current.length) {
          isDeleting = true
          timeoutId = setTimeout(type, 1500)
        } else {
          timeoutId = setTimeout(type, 100)
        }
      }
    }

    timeoutId = setTimeout(type, 500)
    return () => clearTimeout(timeoutId)
  }, [profile?.title])

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
          <Suspense fallback={null}>
            <ParticleField count={1500} />
            <FloatingGeometry />
          </Suspense>
        </Canvas>
      </div>
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-6"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-cyan-neon text-sm tracking-widest uppercase glow-text"
          >
            Hello, I am
          </motion.p>
          <h1 className="text-5xl font-bold text-white md:text-7xl lg:text-8xl">
            {profile?.name ?? 'Your Name'}
          </h1>
          <div className="flex items-center justify-center gap-2 text-xl text-slate-300 md:text-2xl min-h-[2rem]">
            <span ref={titleRef} className="text-cyan-neon font-mono glow-text" />
            <span className="animate-pulse text-cyan-neon">|</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-lg px-6 py-3 text-sm font-medium text-cyan-neon border-glow hover:glow-cyan transition-all duration-300"
              >
                GitHub
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-lg px-6 py-3 text-sm font-medium text-blue-neon border-glow hover:glow-cyan transition-all duration-300"
              >
                LinkedIn
              </a>
            )}
            <a
              href="#contact"
              className="rounded-lg bg-cyan-neon px-6 py-3 text-sm font-semibold text-navy-950 hover:bg-cyan-glow transition-all duration-300 glow-cyan"
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <span className="text-xs font-mono tracking-widest">SCROLL</span>
            <div className="h-8 w-px bg-gradient-to-b from-cyan-neon to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
