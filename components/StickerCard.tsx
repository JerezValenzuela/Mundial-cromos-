'use client'

import { useState } from 'react'
import { Sticker } from '@/lib/supabase'

type Props = { sticker: Sticker; onMark: (id: string) => void }

export function StickerCard({ sticker, onMark }: Props) {
  const [loading, setLoading] = useState(false)

  const handleMark = async () => {
    setLoading(true)
    await onMark(sticker.id)
    setLoading(false)
  }

  if (sticker.obtained) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl p-2.5 gap-1.5"
        style={{
          background: 'var(--greenglass)',
          border: '1px solid var(--greenborder)',
          boxShadow: '0 2px 12px var(--greenglow)',
        }}
      >
        <span className="text-sm font-bold line-through" style={{ color: 'var(--green)', opacity: 0.6 }}>
          {sticker.number}
        </span>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold"
          style={{ background: 'var(--green)', boxShadow: '0 0 10px var(--greenglow)' }}
        >✓</div>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl p-2.5 gap-1.5 cursor-pointer transition-all duration-200"
      style={{
        background: 'var(--glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'scale(1.08)'
        el.style.borderColor = 'rgba(255,107,26,0.5)'
        el.style.boxShadow = '0 4px 16px var(--accentglow)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'scale(1)'
        el.style.borderColor = 'var(--glass-border)'
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
      }}
    >
      <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{sticker.number}</span>
      <button
        onClick={handleMark}
        disabled={loading}
        className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-110 disabled:opacity-40"
        style={{ borderColor: 'var(--accent)', color: 'var(--accent)', background: 'transparent' }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = 'var(--accent)'
          el.style.color = 'white'
          el.style.boxShadow = '0 0 12px var(--accentglow)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = 'transparent'
          el.style.color = 'var(--accent)'
          el.style.boxShadow = 'none'
        }}
        title="Marcar como obtenido"
      >
        {loading ? '·' : '✓'}
      </button>
    </div>
  )
}
