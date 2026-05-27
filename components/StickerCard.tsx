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
      <div className="flex flex-col items-center justify-center rounded-2xl p-2.5 gap-1 border-2 transition-all"
        style={{ background: 'var(--greenbg)', borderColor: 'var(--greenb)' }}>
        <span className="text-sm font-bold tabular-nums line-through" style={{ color: 'var(--green)', opacity: 0.7 }}>
          {sticker.number}
        </span>
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ background: 'var(--green)', boxShadow: '0 2px 8px rgba(34,197,94,0.4)' }}>
          ✓
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl p-2.5 gap-1 border transition-all duration-200 cursor-pointer"
      style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--accent)'
        el.style.boxShadow = '0 4px 16px rgba(249,115,22,0.2)'
        el.style.transform = 'scale(1.05)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--border)'
        el.style.boxShadow = 'none'
        el.style.transform = 'scale(1)'
      }}
    >
      <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--text)' }}>
        {sticker.number}
      </span>
      <button
        onClick={handleMark}
        disabled={loading}
        className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-110 disabled:opacity-40"
        style={{ borderColor: 'var(--accent)', color: 'var(--accent)', background: 'transparent' }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = 'var(--accent)'
          el.style.color = 'white'
          el.style.boxShadow = '0 0 10px rgba(249,115,22,0.5)'
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
