'use client'

import { Sticker } from '@/lib/supabase'

type Props = {
  sticker: Sticker
  onMark: (id: string) => void
}

export function StickerCard({ sticker, onMark }: Props) {
  return (
    <div className="relative flex flex-col items-center justify-center bg-[#0f1e3a] border border-[#1e3560] rounded-xl p-4 gap-2 group hover:border-[#E8600A] transition-all duration-200">
      <span className="text-2xl font-bold text-white">{sticker.number}</span>
      <button
        onClick={() => onMark(sticker.id)}
        className="w-8 h-8 rounded-full bg-[#1e3560] border-2 border-[#E8600A] flex items-center justify-center text-[#E8600A] hover:bg-[#E8600A] hover:text-white transition-all duration-200 text-lg font-bold"
        title="Marcar como obtenido"
        aria-label={`Marcar cromo ${sticker.number} como obtenido`}
      >
        ✓
      </button>
    </div>
  )
}
