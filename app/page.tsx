'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useStickers } from '@/hooks/useStickers'
import { TeamCard } from '@/components/TeamCard'
import { Header } from '@/components/Header'
import { TEAM_ORDER, TEAM_NAMES, TEAM_FLAGS } from '@/lib/stickerData'

const glassInput = {
  background: 'var(--input-bg)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid var(--input-border)',
  color: 'var(--text)',
  borderRadius: '14px',
  padding: '14px 18px',
  fontSize: '15px',
  width: '100%',
  outline: 'none',
  transition: 'all 0.2s ease',
} as React.CSSProperties

export default function HomePage() {
  const { stickers, missingByTeam, totalMissing, loading, markObtained } = useStickers()
  const [teamSearch, setTeamSearch] = useState('')
  const [stickerQuery, setStickerQuery] = useState('')
  const [marking, setMarking] = useState(false)

  type SR =
    | { found: false; team: string; number: number }
    | { found: true; sticker: NonNullable<typeof stickers[number]> }

  const stickerResult: SR | null = (() => {
    const q = stickerQuery.trim().toUpperCase().replace(/\s+/, '-')
    if (!q) return null
    const parts = q.split('-')
    if (parts.length < 2) return null
    const [team, numStr] = parts
    const number = parseInt(numStr)
    if (!team || isNaN(number)) return null
    const sticker = stickers.find(s => s.team === team && s.number === number)
    if (!sticker) return { found: false, team, number }
    return { found: true, sticker }
  })()

  const filteredTeams = TEAM_ORDER.filter(code => {
    if (!teamSearch) return true
    const q = teamSearch.toLowerCase()
    return code.toLowerCase().includes(q) || (TEAM_NAMES[code] ?? '').toLowerCase().includes(q)
  })

  const handleMarkFromSearch = async () => {
    if (!stickerResult?.found || stickerResult.sticker.obtained) return
    setMarking(true)
    await markObtained(stickerResult.sticker.id)
    setMarking(false)
  }

  const teamCode = stickerResult ? (stickerResult.found ? stickerResult.sticker.team : stickerResult.team) : null
  const teamPending = teamCode ? (missingByTeam[teamCode] ?? []).filter(s => !s.obtained) : []
  const isNeed = stickerResult?.found && !stickerResult.sticker.obtained

  return (
    <div className="page-bg">
      <div className="relative z-10 min-h-screen flex flex-col">

        <Header totalMissing={totalMissing} loading={loading} />

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-4 pb-10 space-y-6">

          {/* ── Search glass card ── */}
          <div
            className="glass-strong rounded-3xl p-6 space-y-5 mx-auto max-w-2xl"
          >
            {/* Sticker search */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text3)' }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--accent)' }} />
                Buscar cromo — ej: URU 6 · MEX 3 · ESP 10
              </label>

              <div className="flex gap-2">
                <input
                  style={glassInput}
                  value={stickerQuery}
                  onChange={e => setStickerQuery(e.target.value)}
                  placeholder="URU 6"
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(255,107,26,0.6)'
                    e.target.style.boxShadow = '0 0 0 4px var(--accentglow)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--input-border)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                {stickerQuery && (
                  <button
                    onClick={() => setStickerQuery('')}
                    className="px-4 rounded-2xl text-sm font-medium transition-all hover:opacity-70"
                    style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text3)' }}
                  >✕</button>
                )}
              </div>

              {/* Result */}
              {stickerResult && (
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: `1px solid ${isNeed ? 'var(--greenborder)' : 'rgba(255,107,26,0.35)'}`,
                    boxShadow: isNeed ? '0 4px 20px var(--greenglow)' : '0 4px 20px var(--accentglow)',
                  }}
                >
                  {/* Top result row */}
                  <div
                    className="flex items-center justify-between gap-3 px-4 py-3"
                    style={{ background: isNeed ? 'var(--greenglass)' : 'rgba(255,107,26,0.08)' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{isNeed ? '👀' : '🎉'}</span>
                      <div>
                        <p className="font-bold text-sm" style={{ color: isNeed ? 'var(--green)' : 'var(--accent)' }}>
                          {!stickerResult.found
                            ? `${stickerResult.team}-${stickerResult.number}`
                            : `${TEAM_FLAGS[stickerResult.sticker.team]} ${TEAM_NAMES[stickerResult.sticker.team]} #${stickerResult.sticker.number}`}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: isNeed ? 'var(--green)' : 'var(--accent)', opacity: 0.75 }}>
                          {!stickerResult.found ? '¡Ya lo tienes! No estaba en tu lista'
                            : stickerResult.sticker.obtained ? '¡Ya lo tienes marcado!'
                            : 'Te falta — ¡consíguelo!'}
                        </p>
                        {teamCode && (
                          <p className="text-xs mt-0.5" style={{ color: isNeed ? 'var(--green)' : 'var(--accent)', opacity: 0.55 }}>
                            {TEAM_NAMES[teamCode] ?? teamCode}:{' '}
                            {teamPending.length === 0 ? '¡equipo completo! ✓' : `${teamPending.length} pendientes`}
                          </p>
                        )}
                      </div>
                    </div>
                    {stickerResult.found && !stickerResult.sticker.obtained && (
                      <button
                        onClick={handleMarkFromSearch}
                        disabled={marking}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 disabled:opacity-50 shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, var(--green), #6ee7b7)',
                          boxShadow: '0 4px 14px var(--greenglow)',
                        }}
                      >
                        {marking ? '…' : '✓ Lo tengo'}
                      </button>
                    )}
                  </div>

                  {/* Number circles */}
                  {teamPending.length > 0 && (
                    <div
                      className="px-4 py-3 border-t"
                      style={{ borderColor: isNeed ? 'var(--greenborder)' : 'rgba(255,107,26,0.15)', background: 'rgba(0,0,0,0.1)' }}
                    >
                      <p className="text-xs font-semibold mb-2.5" style={{ color: 'var(--text3)' }}>
                        Pendientes de {TEAM_NAMES[teamCode!] ?? teamCode}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {teamPending.map(s => {
                          const isThis = stickerResult.found && stickerResult.sticker.id === s.id
                          return (
                            <div
                              key={s.id}
                              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                              style={{
                                background: isThis
                                  ? 'linear-gradient(135deg, var(--accent), var(--gold))'
                                  : 'var(--glass)',
                                border: `1.5px solid ${isThis ? 'var(--accent2)' : 'var(--glass-border)'}`,
                                color: isThis ? 'white' : 'var(--text2)',
                                boxShadow: isThis ? '0 0 16px var(--accentglow)' : 'none',
                                transform: isThis ? 'scale(1.2)' : 'scale(1)',
                              }}
                            >
                              {s.number}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--glass-border)' }} />

            {/* Team search */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text3)' }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--text3)' }} />
                Buscar equipo
              </label>
              <div className="flex gap-2">
                <input
                  style={glassInput}
                  value={teamSearch}
                  onChange={e => setTeamSearch(e.target.value)}
                  placeholder="México, ESP, Francia..."
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--glass-strong)'
                    e.target.style.boxShadow = '0 0 0 4px rgba(255,255,255,0.06)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--input-border)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                {teamSearch && (
                  <button
                    onClick={() => setTeamSearch('')}
                    className="px-4 rounded-2xl text-sm font-medium transition-all hover:opacity-70"
                    style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text3)' }}
                  >✕</button>
                )}
              </div>
            </div>
          </div>

          {/* ── Team grid ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div
                className="w-10 h-10 rounded-full border-2 animate-spin"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
              />
              <p className="text-sm" style={{ color: 'var(--text3)' }}>Cargando cromos...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-center" style={{ color: 'var(--text3)' }}>
                {filteredTeams.length} equipos{teamSearch ? ` · "${teamSearch}"` : ''}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                {filteredTeams.map(code => (
                  <TeamCard
                    key={code}
                    teamCode={code}
                    missingCount={missingByTeam[code]?.filter(s => !s.obtained).length ?? 0}
                    totalCount={missingByTeam[code]?.length ?? 0}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
