'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionWrapper from '@/components/ui/SectionWrapper'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <SectionWrapper id="contact" title="Contact">
      <div className="max-w-2xl mx-auto">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 border-glow space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 tracking-widest">NAME</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-navy-900 border border-slate-700 focus:border-cyan-neon/50 rounded-lg px-4 py-3 text-white text-sm outline-none transition-colors placeholder-slate-600"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 tracking-widest">EMAIL</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-navy-900 border border-slate-700 focus:border-cyan-neon/50 rounded-lg px-4 py-3 text-white text-sm outline-none transition-colors placeholder-slate-600"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2 tracking-widest">MESSAGE</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="w-full bg-navy-900 border border-slate-700 focus:border-cyan-neon/50 rounded-lg px-4 py-3 text-white text-sm outline-none transition-colors placeholder-slate-600 resize-none"
              placeholder="What&apos;s on your mind?"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-cyan-neon hover:bg-cyan-glow text-navy-950 font-semibold py-3 rounded-lg transition-all duration-300 glow-cyan disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
          {status === 'success' && (
            <p className="text-emerald-400 text-sm text-center font-mono">✓ Message sent successfully!</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-sm text-center font-mono">Something went wrong. Please try again.</p>
          )}
        </motion.form>
      </div>
    </SectionWrapper>
  )
}
