'use client'

import { useState } from 'react'
import { Sticker } from '@/lib/supabase'

type Props = {
  sticker: Sticker
  onMark: (id: string) => void
}

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
        className="flex flex-col items-center justify-center rounded-2xl p-3 gap-1 border-2"
        style={{ background: 'var(--green-bg)', borderColor: 'var(--green-b)' }}
      >
        <span className="text-lg font-bold line-through" style={{ color: 'var(--green)' }}>
          {sticker.number}
        </span>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: 'var(--green)' }}
        >
          ✓
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl p-3 gap-1 border transition-all duration-200 hover:shadow-md"
      style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
    >
      <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>
        {sticker.number}
      </span>
      <button
        onClick={handleMark}
        disabled={loading}
        className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-200 hover:scale-110 disabled:opacity-50"
        style={{
          borderColor: 'var(--accent)',
          color: 'var(--accent)',
          background: 'transparent',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.background = 'var(--accent)'
          el.style.color = 'white'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.background = 'transparent'
          el.style.color = 'var(--accent)'
        }}
        title="Marcar como obtenido"
      >
        {loading ? '…' : '✓'}
      </button>
    </div>
  )
}
