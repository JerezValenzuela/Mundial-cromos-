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

  const all = missingByTeam[code] ?? []
  const pending = all.filter(s => !s.obtained)
  const obtained = all.filter(s => s.obtained)
  const teamName = TEAM_NAMES[code] ?? code
  const teamFlag = TEAM_FLAGS[code] ?? '🏳️'
  const pct = all.length > 0 ? (obtained.length / all.length) * 100 : 100

  return (
    <div className="min-h-screen transition-colors" style={{ background: 'var(--bg)' }}>
      <Header totalMissing={totalMissing} loading={loading} />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">

        <Link href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-all hover:opacity-70"
          style={{ color: 'var(--text3)' }}>
          ← Volver a equipos
        </Link>

        {/* Team header card */}
        <div className="rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-5"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0"
            style={{ background: 'var(--bg3)', boxShadow: 'var(--shadow-sm)' }}>
            {teamFlag}
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
                {teamName}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text2)' }}>
                {loading ? 'Cargando...'
                  : pending.length === 0 ? '🎉 ¡Colección completa!'
                  : `${pending.length} pendientes · ${obtained.length} conseguidos`}
              </p>
            </div>
            <div className="space-y-1">
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: pct === 100
                      ? 'linear-gradient(90deg, var(--green), #4ade80)'
                      : 'linear-gradient(90deg, var(--accent), var(--accent2))',
                    boxShadow: pct === 100
                      ? '0 0 8px rgba(34,197,94,0.5)'
                      : '0 0 8px rgba(249,115,22,0.4)',
                  }} />
              </div>
              <p className="text-xs font-medium" style={{ color: 'var(--text3)' }}>
                {Math.round(pct)}% completado
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: 'var(--text3)' }}>Cargando...</p>
            </div>
          </div>
        ) : all.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-6xl">🎉</span>
            <p className="text-xl font-bold" style={{ color: 'var(--green)' }}>¡Todos conseguidos!</p>
            <Link href="/" className="text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: 'var(--accent)' }}>
              Ver otros equipos →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {pending.length > 0 && (
              <div className="rounded-2xl border p-4 space-y-3"
                style={{ background: 'var(--bg2)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
                    Pendientes — {pending.length}
                  </p>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                  {pending.map(s => (
                    <StickerCard key={s.id} sticker={s} onMark={markObtained} />
                  ))}
                </div>
              </div>
            )}

            {obtained.length > 0 && (
              <div className="rounded-2xl border p-4 space-y-3"
                style={{ background: 'var(--bg2)', borderColor: 'var(--greenb)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)' }} />
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
                    Conseguidos — {obtained.length}
                  </p>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
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
