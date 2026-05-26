'use client'

import { use } from 'react'
import Link from 'next/link'
import { useStickers } from '@/hooks/useStickers'
import { StickerCard } from '@/components/StickerCard'
import { Header } from '@/components/Header'
import { TEAM_NAMES, TEAM_FLAGS } from '@/lib/stickerData'

type Props = {
  params: Promise<{ code: string }>
}

export default function TeamPage({ params }: Props) {
  const { code } = use(params)
  const { missingByTeam, totalMissing, loading, markObtained } = useStickers()

  const teamStickers = missingByTeam[code] ?? []
  const teamName = TEAM_NAMES[code] ?? code
  const teamFlag = TEAM_FLAGS[code] ?? '🏳️'

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Header totalMissing={totalMissing} loading={loading} />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#89a8d4] hover:text-white text-sm mb-6 transition-colors"
        >
          ← Volver a equipos
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{teamFlag}</span>
          <div>
            <h2 className="text-white text-2xl font-bold">{teamName}</h2>
            <p className="text-[#89a8d4] text-sm">
              {loading
                ? 'Cargando...'
                : teamStickers.length === 0
                ? '¡Colección completa!'
                : `${teamStickers.length} cromos pendientes`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#89a8d4] text-lg animate-pulse">Cargando cromos...</div>
          </div>
        ) : teamStickers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="text-5xl">🎉</span>
            <p className="text-green-400 text-xl font-bold">¡Todos los cromos conseguidos!</p>
            <Link href="/" className="text-[#E8600A] hover:underline text-sm">
              Ver otros equipos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {teamStickers.map((sticker) => (
              <StickerCard key={sticker.id} sticker={sticker} onMark={markObtained} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
