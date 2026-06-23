'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
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

const sectionLabels: Record<string, string> = {
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  internships: 'Experience',
  certifications: 'Certifications',
  achievements: 'Achievements'
}

const sectionKeys = ['education', 'skills', 'projects', 'internships', 'certifications', 'achievements'] as const

type SectionKey = typeof sectionKeys[number]

export default function ResumeDownload(props: ResumeDownloadProps) {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [latexLoading, setLatexLoading] = useState(false)
  const [latex, setLatex] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [intent, setIntent] = useState<'pdf' | 'latex'>('pdf')
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const allIds: Record<SectionKey, string[]> = {
    education: props.education.map(e => e.id),
    skills: props.skills.map(s => s.id),
    projects: props.projects.map(p => p.id),
    internships: props.internships.map(i => i.id),
    certifications: props.certifications.map(c => c.id),
    achievements: props.achievements.map(a => a.id)
  }

  const [selectionMap, setSelectionMap] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {}
    for (const key of sectionKeys) init[key] = [...allIds[key]]
    return init
  })

  const toggleSection = (key: SectionKey) => {
    setSelectionMap(prev => {
      const current = prev[key] ?? []
      const all = allIds[key]
      const allSelected = current.length === all.length && all.length > 0
      return { ...prev, [key]: allSelected ? [] : [...all] }
    })
  }

  const toggleItem = (key: SectionKey, id: string) => {
    setSelectionMap(prev => {
      const current = prev[key] ?? []
      const exists = current.includes(id)
      return {
        ...prev,
        [key]: exists ? current.filter(i => i !== id) : [...current, id]
      }
    })
  }

  const hasSelection = (key: SectionKey) => (selectionMap[key]?.length ?? 0) > 0
  const countSelected = (key: SectionKey) => selectionMap[key]?.length ?? 0
  const countTotal = (key: SectionKey) => allIds[key].length

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

  const filterData = () => {
    const filterByKey = <T extends { id: string }>(key: SectionKey, data: T[]): T[] => {
      const ids = selectionMap[key] ?? []
      if (ids.length === 0) return []
      return data.filter(item => ids.includes(item.id))
    }

    return {
      profile: props.profile,
      education: filterByKey('education', props.education),
      skills: filterByKey('skills', props.skills),
      projects: filterByKey('projects', props.projects),
      internships: filterByKey('internships', props.internships),
      certifications: filterByKey('certifications', props.certifications),
      achievements: filterByKey('achievements', props.achievements)
    }
  }

  const handleDownload = async () => {
    setPdfLoading(true)
    setShowModal(false)
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterData())
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
    setShowModal(false)
    try {
      const res = await fetch('/api/resume?format=latex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterData())
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

  const openModal = (type: 'pdf' | 'latex') => {
    setIntent(type)
    setShowModal(true)
  }

  const getItemLabel = (key: SectionKey, item: Record<string, unknown>): string => {
    switch (key) {
      case 'education': return `${item.institution} — ${item.degree}`
      case 'skills': return item.name as string
      case 'projects': return item.title as string
      case 'internships': return `${item.role} @ ${item.company}`
      case 'certifications': return item.title as string
      case 'achievements': return item.title as string
      default: return ''
    }
  }

  const sectionItemMap: Record<SectionKey, Record<string, unknown>[]> = {
    education: props.education as unknown as Record<string, unknown>[],
    skills: props.skills as unknown as Record<string, unknown>[],
    projects: props.projects as unknown as Record<string, unknown>[],
    internships: props.internships as unknown as Record<string, unknown>[],
    certifications: props.certifications as unknown as Record<string, unknown>[],
    achievements: props.achievements as unknown as Record<string, unknown>[]
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8 px-6">
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal('pdf')}
          disabled={pdfLoading || latexLoading}
          className="glass border-glow glow-cyan px-8 py-4 rounded-xl font-mono text-cyan-neon text-sm tracking-widest hover:bg-cyan-neon/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pdfLoading ? 'GENERATING RESUME...' : '↓ DOWNLOAD RESUME'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal('latex')}
          disabled={latexLoading || pdfLoading}
          className="glass border border-slate-700 px-8 py-4 rounded-xl font-mono text-slate-300 text-sm tracking-widest hover:text-cyan-neon hover:border-cyan-neon/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {latexLoading ? 'GENERATING LATEX...' : 'VIEW LATEX CODE'}
        </motion.button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl border border-cyan-neon/20 p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-lg text-white tracking-wider">Customize Resume</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {sectionKeys.map(key => {
                const total = countTotal(key)
                if (total === 0) return null
                const selected = hasSelection(key)
                const count = countSelected(key)
                const isExpanded = expandedSection === key

                return (
                  <div key={key} className="glass rounded-xl border border-slate-800 overflow-hidden">
                    <div className="flex items-center gap-3 p-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSection(key)}
                        className="w-4 h-4 rounded accent-cyan-neon"
                      />
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : key)}
                        className="flex items-center gap-2 flex-1 text-left"
                      >
                        <span className="text-white font-mono text-sm">{sectionLabels[key]}</span>
                        <span className="text-xs text-slate-500">({count}/{total})</span>
                        {isExpanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="border-t border-slate-800 px-3 py-2 space-y-1">
                        {sectionItemMap[key].map(item => {
                          const id = item.id as string
                          const isItemSelected = selectionMap[key]?.includes(id) ?? false
                          return (
                            <label key={id} className="flex items-center gap-2 py-1 px-1 rounded hover:bg-white/5 cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={isItemSelected}
                                onChange={() => toggleItem(key, id)}
                                className="w-3.5 h-3.5 rounded accent-cyan-neon"
                              />
                              <span className="text-slate-300 text-sm">{getItemLabel(key, item)}</span>
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={intent === 'pdf' ? handleDownload : handleLatex}
                disabled={pdfLoading || latexLoading}
                className="flex-1 bg-cyan-neon text-navy-950 py-3 rounded-xl font-mono text-sm font-semibold tracking-wider hover:bg-cyan-glow transition-all disabled:opacity-50"
              >
                {intent === 'pdf' ? (pdfLoading ? 'GENERATING...' : 'GENERATE PDF') : (latexLoading ? 'GENERATING...' : 'GENERATE LATEX')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

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
