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

  return (
    <div className="min-h-screen transition-colors" style={{ background: 'var(--bg)' }}>
      <Header totalMissing={totalMissing} loading={loading} />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Search section */}
        <div className="rounded-2xl border p-4 space-y-4 shadow-sm transition-colors"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>

          {/* Sticker lookup */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: 'var(--text2)' }}>
              🔍 Buscar cromo — ej: URU 6, MEX-3, ESP 10
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={stickerQuery}
                onChange={e => setStickerQuery(e.target.value)}
                placeholder="URU 6"
                className="flex-1 rounded-xl px-4 py-2.5 text-sm border outline-none transition-all"
                style={{
                  background: 'var(--bg3)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
              {stickerQuery && (
                <button onClick={() => setStickerQuery('')}
                  className="px-3 rounded-xl text-sm transition-colors"
                  style={{ color: 'var(--text3)', background: 'var(--bg3)' }}>
                  ✕
                </button>
              )}
            </div>

            {stickerResult && (
              <div
                className="mt-3 px-4 py-3 rounded-xl border-2 flex items-center justify-between gap-3 transition-all"
                style={
                  !stickerResult.found
                    ? { background: 'rgba(232,96,10,0.12)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                    : stickerResult.sticker.obtained
                    ? { background: 'rgba(232,96,10,0.12)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                    : { background: 'var(--green-bg)', borderColor: 'var(--green-b)', color: 'var(--green)' }
                }
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {!stickerResult.found ? '🎉'
                      : stickerResult.sticker.obtained ? '🎉'
                      : '👀'}
                  </span>
                  <div>
                    <p className="font-bold text-sm">
                      {!stickerResult.found
                        ? `${stickerResult.team}-${stickerResult.number}`
                        : `${TEAM_FLAGS[stickerResult.sticker.team]} ${TEAM_NAMES[stickerResult.sticker.team]} #${stickerResult.sticker.number}`}
                    </p>
                    <p className="text-xs opacity-80">
                      {!stickerResult.found
                        ? '¡Ya lo tienes! No está en tu lista de faltantes'
                        : stickerResult.sticker.obtained
                        ? '¡Ya lo tienes marcado!'
                        : 'Te falta — ¡consíguelo!'}
                    </p>
                  </div>
                </div>

                {stickerResult.found && !stickerResult.sticker.obtained && (
                  <button
                    onClick={handleMarkFromSearch}
                    disabled={marking}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 disabled:opacity-50 shrink-0"
                    style={{ background: 'var(--green)' }}
                  >
                    {marking ? '…' : '✓ Lo tengo'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Team search */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: 'var(--text2)' }}>
              🌍 Buscar equipo
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={teamSearch}
                onChange={e => setTeamSearch(e.target.value)}
                placeholder="México, ESP, Francia..."
                className="flex-1 rounded-xl px-4 py-2.5 text-sm border outline-none transition-all"
                style={{
                  background: 'var(--bg3)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
              {teamSearch && (
                <button onClick={() => setTeamSearch('')}
                  className="px-3 rounded-xl text-sm"
                  style={{ color: 'var(--text3)', background: 'var(--bg3)' }}>
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Team grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-sm animate-pulse" style={{ color: 'var(--text2)' }}>
              Cargando cromos...
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs" style={{ color: 'var(--text3)' }}>
              {filteredTeams.length} equipo{filteredTeams.length !== 1 ? 's' : ''}
              {teamSearch ? ` para "${teamSearch}"` : ''}
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
          </>
        )}
      </main>
    </div>
  )
}
