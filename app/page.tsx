'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useStickers } from '@/hooks/useStickers'
import { TeamCard } from '@/components/TeamCard'
import { Header } from '@/components/Header'
import { TEAM_ORDER, TEAM_NAMES, TEAM_FLAGS } from '@/lib/stickerData'

export default function HomePage() {
  const { stickers, missingByTeam, totalMissing, loading, markObtained } = useStickers()
  const [teamSearch, setTeamSearch] = useState('')
  const [stickerQuery, setStickerQuery] = useState('')
  const [marking, setMarking] = useState(false)

  type StickerResult =
    | { found: false; team: string; number: number }
    | { found: true; sticker: NonNullable<typeof stickers[number]> }

  const stickerResult: StickerResult | null = (() => {
    const q = stickerQuery.trim().toUpperCase().replace(/[\s]+/, '-')
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
    if (!stickerResult || !stickerResult.found || stickerResult.sticker.obtained) return
    setMarking(true)
    await markObtained(stickerResult.sticker.id)
    setMarking(false)
  }

  // For the sticker result: get team's remaining stickers as circles
  const teamForResult = stickerResult
    ? stickerResult.found ? stickerResult.sticker.team : stickerResult.team
    : null
  const teamResultStickers = teamForResult ? (missingByTeam[teamForResult] ?? []) : []
  const teamResultPending = teamResultStickers.filter(s => !s.obtained)

  const isGood = !stickerResult ? false
    : !stickerResult.found ? false
    : stickerResult.sticker.obtained ? false
    : true // needs to be obtained

  return (
    <div className="min-h-screen transition-colors" style={{ background: 'var(--bg)' }}>
      <Header totalMissing={totalMissing} loading={loading} />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">

        {/* Search card */}
        <div className="rounded-2xl border p-5 space-y-5 transition-colors"
          style={{
            background: 'var(--bg2)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow)',
          }}>

          {/* Sticker lookup */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              style={{ color: 'var(--text3)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
              Buscar cromo — ej: URU 6, MEX-3, ESP 10
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={stickerQuery}
                  onChange={e => setStickerQuery(e.target.value)}
                  placeholder="URU 6"
                  className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200"
                  style={{
                    background: 'var(--bg3)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--accent)'
                    e.target.style.boxShadow = 'var(--glow)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border)'
                    e.target.style.boxShadow = 'var(--shadow-sm)'
                  }}
                />
              </div>
              {stickerQuery && (
                <button onClick={() => setStickerQuery('')}
                  className="px-4 rounded-xl text-sm font-medium transition-all hover:opacity-70"
                  style={{ color: 'var(--text3)', background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                  ✕
                </button>
              )}
            </div>

            {/* Result box */}
            {stickerResult && (
              <div className="rounded-xl border-2 overflow-hidden transition-all"
                style={{
                  borderColor: isGood ? 'var(--greenb)' : 'var(--accent)',
                  boxShadow: isGood ? '0 4px 20px rgba(34,197,94,0.15)' : '0 4px 20px rgba(249,115,22,0.15)',
                }}>

                {/* Top row */}
                <div className="flex items-center justify-between gap-3 px-4 py-3"
                  style={{ background: isGood ? 'var(--greenbg)' : 'var(--accentbg)' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {isGood ? '👀' : '🎉'}
                    </span>
                    <div>
                      <p className="font-bold text-sm"
                        style={{ color: isGood ? 'var(--green)' : 'var(--accent)' }}>
                        {!stickerResult.found
                          ? `${stickerResult.team}-${stickerResult.number}`
                          : `${TEAM_FLAGS[stickerResult.sticker.team]} ${TEAM_NAMES[stickerResult.sticker.team]} #${stickerResult.sticker.number}`}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: isGood ? 'var(--green)' : 'var(--accent)', opacity: 0.75 }}>
                        {!stickerResult.found
                          ? '¡Ya lo tienes! No está en tu lista de faltantes'
                          : stickerResult.sticker.obtained
                          ? '¡Ya lo tienes marcado!'
                          : 'Te falta — ¡consíguelo!'}
                      </p>
                      {teamResultStickers.length > 0 && (
                        <p className="text-xs mt-0.5" style={{ color: isGood ? 'var(--green)' : 'var(--accent)', opacity: 0.6 }}>
                          {TEAM_NAMES[teamForResult!] ?? teamForResult}:{' '}
                          {teamResultPending.length === 0
                            ? '¡equipo completo! ✓'
                            : `${teamResultPending.length} cromo${teamResultPending.length !== 1 ? 's' : ''} pendientes`}
                        </p>
                      )}
                    </div>
                  </div>

                  {stickerResult.found && !stickerResult.sticker.obtained && (
                    <button
                      onClick={handleMarkFromSearch}
                      disabled={marking}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 hover:opacity-90 disabled:opacity-50 shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, var(--green), #4ade80)',
                        boxShadow: '0 4px 14px rgba(34,197,94,0.4)',
                      }}>
                      {marking ? '…' : '✓ Lo tengo'}
                    </button>
                  )}
                </div>

                {/* Sticker circles for the team */}
                {teamResultPending.length > 0 && (
                  <div className="px-4 py-3 border-t"
                    style={{ borderColor: isGood ? 'var(--greenb)' : 'var(--accentbg)', background: 'var(--bg3)' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text3)' }}>
                      Cromos pendientes de {TEAM_NAMES[teamForResult!] ?? teamForResult}:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {teamResultPending.map(s => {
                        const isThis = stickerResult.found && stickerResult.sticker.id === s.id
                        return (
                          <div key={s.id}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                            style={{
                              background: isThis ? 'var(--accent)' : 'var(--bg4)',
                              borderColor: isThis ? 'var(--accent2)' : 'var(--border2)',
                              color: isThis ? 'white' : 'var(--text2)',
                              boxShadow: isThis ? '0 0 12px rgba(249,115,22,0.5)' : 'none',
                              transform: isThis ? 'scale(1.15)' : 'scale(1)',
                            }}>
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
          <div style={{ height: '1px', background: 'var(--border)' }} />

          {/* Team search */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              style={{ color: 'var(--text3)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--navy2)' }} />
              Buscar equipo
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={teamSearch}
                onChange={e => setTeamSearch(e.target.value)}
                placeholder="México, ESP, Francia..."
                className="flex-1 rounded-xl px-4 py-3 text-sm border outline-none transition-all duration-200"
                style={{
                  background: 'var(--bg3)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--border2)'
                  e.target.style.boxShadow = '0 0 20px rgba(42,80,153,0.2)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border)'
                  e.target.style.boxShadow = 'var(--shadow-sm)'
                }}
              />
              {teamSearch && (
                <button onClick={() => setTeamSearch('')}
                  className="px-4 rounded-xl text-sm font-medium transition-all hover:opacity-70"
                  style={{ color: 'var(--text3)', background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Team grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
              <p className="text-sm" style={{ color: 'var(--text3)' }}>Cargando cromos...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-medium" style={{ color: 'var(--text3)' }}>
              {filteredTeams.length} equipo{filteredTeams.length !== 1 ? 's' : ''}
              {teamSearch ? ` · "${teamSearch}"` : ''}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
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
  )
}
