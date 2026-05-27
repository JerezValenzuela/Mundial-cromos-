'use client'

import { use } from 'react'
import Link from 'next/link'
import { useStickers } from '@/hooks/useStickers'
import { StickerCard } from '@/components/StickerCard'
import { Header } from '@/components/Header'
import { TEAM_NAMES, TEAM_FLAGS } from '@/lib/stickerData'

type Props = { params: Promise<{ code: string }> }

export default function TeamPage({ params }: Props) {
  const { code } = use(params)
  const { missingByTeam, totalMissing, loading, markObtained } = useStickers()

  const allStickers = missingByTeam[code] ?? []
  const pending = allStickers.filter(s => !s.obtained)
  const obtained = allStickers.filter(s => s.obtained)
  const teamName = TEAM_NAMES[code] ?? code
  const teamFlag = TEAM_FLAGS[code] ?? '🏳️'
  const pct = allStickers.length > 0 ? (obtained.length / allStickers.length) * 100 : 100

  return (
    <div className="min-h-screen transition-colors" style={{ background: 'var(--bg)' }}>
      <Header totalMissing={totalMissing} loading={loading} />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Back + team info */}
        <div>
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-sm mb-4 transition-colors hover:opacity-70"
            style={{ color: 'var(--text2)' }}>
            ← Volver
          </Link>

          <div className="rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm"
            style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
            <span className="text-5xl">{teamFlag}</span>
            <div className="flex-1">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{teamName}</h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
                {loading ? 'Cargando...'
                  : pending.length === 0 ? '¡Colección completa! 🎉'
                  : `${pending.length} pendientes · ${obtained.length} conseguidos`}
              </p>
              <div className="mt-3 w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: pct === 100 ? 'var(--green)' : 'var(--accent)' }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>
                {Math.round(pct)}% completado
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-sm animate-pulse" style={{ color: 'var(--text2)' }}>Cargando cromos...</div>
          </div>
        ) : allStickers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="text-5xl">🎉</span>
            <p className="font-bold text-xl" style={{ color: 'var(--green)' }}>¡Todos conseguidos!</p>
            <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--accent)' }}>
              Ver otros equipos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text2)' }}>
                  Pendientes ({pending.length})
                </p>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                  {pending.map(s => (
                    <StickerCard key={s.id} sticker={s} onMark={markObtained} />
                  ))}
                </div>
              </div>
            )}

            {obtained.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text2)' }}>
                  Conseguidos ({obtained.length})
                </p>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                  {obtained.map(s => (
                    <StickerCard key={s.id} sticker={s} onMark={markObtained} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
