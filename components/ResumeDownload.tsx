'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type {
  Profile, Education, Skill, Project,
  Internship, Certification, Achievement
} from '@/lib/db/schema'

interface ResumeDownloadProps {
  profile: Profile | null
  education: Education[]
  skills: Skill[]
  projects: Project[]
  internships: Internship[]
  certifications: Certification[]
  achievements: Achievement[]
}

export default function ResumeDownload(props: ResumeDownloadProps) {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [latexLoading, setLatexLoading] = useState(false)
  const [latex, setLatex] = useState('')

  const fileName = `${props.profile?.name?.replace(/\s+/g, '_') ?? 'resume'}_resume`

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownload = async () => {
    setPdfLoading(true)
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(props)
      })
      if (!res.ok) throw new Error('Failed to generate resume')
      const blob = await res.blob()
      downloadBlob(blob, `${fileName}.pdf`)
    } catch {
      alert('Resume generation failed. Please try again later.')
    } finally {
      setPdfLoading(false)
    }
  }

  const handleLatex = async () => {
    setLatexLoading(true)
    try {
      const res = await fetch('/api/resume?format=latex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(props)
      })
      if (!res.ok) throw new Error('Failed to generate LaTeX')
      const code = await res.text()
      setLatex(code)
    } catch {
      alert('LaTeX generation failed. Please try again later.')
    } finally {
      setLatexLoading(false)
    }
  }

  const handleLatexDownload = () => {
    if (!latex) return
    downloadBlob(new Blob([latex], { type: 'text/plain' }), `${fileName}.tex`)
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8 px-6">
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          disabled={pdfLoading}
          className="glass border-glow glow-cyan px-8 py-4 rounded-xl font-mono text-cyan-neon text-sm tracking-widest hover:bg-cyan-neon/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pdfLoading ? 'GENERATING RESUME...' : '↓ DOWNLOAD RESUME'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLatex}
          disabled={latexLoading}
          className="glass border border-slate-700 px-8 py-4 rounded-xl font-mono text-slate-300 text-sm tracking-widest hover:text-cyan-neon hover:border-cyan-neon/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {latexLoading ? 'GENERATING LATEX...' : 'VIEW LATEX CODE'}
        </motion.button>
      </div>
      {latex && (
        <div className="w-full max-w-5xl glass rounded-2xl border border-cyan-neon/20 p-4">
          <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-neon">
              Editable LaTeX Source
            </p>
            <button
              onClick={handleLatexDownload}
              className="font-mono text-xs text-slate-300 hover:text-cyan-neon border border-slate-700 hover:border-cyan-neon/50 px-3 py-2 rounded-lg transition-all duration-200"
            >
              DOWNLOAD .TEX
            </button>
          </div>
          <textarea
            readOnly
            value={latex}
            className="h-96 w-full resize-y rounded-xl border border-slate-800 bg-black/40 p-4 font-mono text-xs leading-relaxed text-slate-300 outline-none"
          />
        </div>
      )}
    </div>
  )
}
