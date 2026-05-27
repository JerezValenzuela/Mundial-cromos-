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
  const pct = all.length > 0 ? Math.round((obtained.length / all.length) * 100) : 100

  return (
    <div className="page-bg">
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header totalMissing={totalMissing} loading={loading} />

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-4 pb-10 space-y-5">

          <Link href="/"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:opacity-60"
            style={{ color: 'var(--text3)' }}>
            ← Volver
          </Link>

          {/* Team hero card */}
          <div
            className="glass-strong rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center gap-5"
          >
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl shrink-0"
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}
            >
              {teamFlag}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text)' }}>{teamName}</h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
                  {loading ? 'Cargando...'
                    : pending.length === 0 ? '🎉 ¡Colección completa!'
                    : `${pending.length} pendientes · ${obtained.length} conseguidos`}
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: pct === 100
                        ? 'linear-gradient(90deg, var(--green), #6ee7b7)'
                        : 'linear-gradient(90deg, var(--accent), var(--gold))',
                      boxShadow: pct === 100 ? '0 0 10px var(--greenglow)' : '0 0 10px var(--accentglow)',
                    }}
                  />
                </div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text3)' }}>{pct}% completado</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 rounded-full border-2 animate-spin"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: 'var(--text3)' }}>Cargando...</p>
            </div>
          ) : all.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <span className="text-6xl">🎉</span>
              <p className="text-xl font-bold" style={{ color: 'var(--green)' }}>¡Todos conseguidos!</p>
              <Link href="/" className="text-sm font-medium hover:opacity-70" style={{ color: 'var(--accent)' }}>
                Ver otros equipos →
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {pending.length > 0 && (
                <div className="glass rounded-3xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
                      Pendientes — {pending.length}
                    </p>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                    {pending.map(s => <StickerCard key={s.id} sticker={s} onMark={markObtained} />)}
                  </div>
                </div>
              )}

              {obtained.length > 0 && (
                <div className="glass rounded-3xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)' }} />
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text3)' }}>
                      Conseguidos — {obtained.length}
                    </p>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                    {obtained.map(s => <StickerCard key={s.id} sticker={s} onMark={markObtained} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
