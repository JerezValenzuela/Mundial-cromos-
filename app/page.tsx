'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useStickers } from '@/hooks/useStickers'
import { TeamCard } from '@/components/TeamCard'
import { Header } from '@/components/Header'
import { TEAM_ORDER, TEAM_NAMES, TEAM_FLAGS } from '@/lib/stickerData'

export default function HomePage() {
  const { stickers, missingByTeam, totalMissing, loading } = useStickers()
  const [teamSearch, setTeamSearch] = useState('')
  const [stickerQuery, setStickerQuery] = useState('')

  // Buscar cromo específico tipo "URU 6" o "MEX-3"
  type StickerResult =
    | { found: false; team: string; number: number }
    | { found: true; sticker: NonNullable<typeof stickers[number]> }

  const stickerResult: StickerResult | null = (() => {
    const q = stickerQuery.trim().toUpperCase().replace(/[-\s]+/, '-')
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

  const filteredTeams = TEAM_ORDER.filter((code) => {
    if (!teamSearch) return true
    const q = teamSearch.toLowerCase()
    return (
      code.toLowerCase().includes(q) ||
      (TEAM_NAMES[code] ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Header totalMissing={totalMissing} loading={loading} />
      <main className="max-w-5xl mx-auto px-4 py-6">

        {/* Buscador de cromo específico */}
        <div className="mb-4">
          <p className="text-[#89a8d4] text-xs mb-1">Buscar cromo (ej: URU 6, MEX-3, ESP 10)</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={stickerQuery}
              onChange={e => setStickerQuery(e.target.value)}
              placeholder="URU 6"
              className="flex-1 bg-[#0f1e3a] border border-[#1e3560] rounded-lg px-4 py-2 text-white placeholder-[#4a6a9a] focus:outline-none focus:border-[#E8600A] text-sm"
            />
            {stickerQuery && (
              <button
                onClick={() => setStickerQuery('')}
                className="px-3 py-2 text-[#89a8d4] hover:text-white text-sm"
              >✕</button>
            )}
          </div>

          {stickerResult && (
            <div className={`mt-2 px-4 py-3 rounded-lg border text-sm flex items-center gap-3 ${
              !stickerResult.found
                ? 'bg-[#2a1a0a] border-[#664422] text-[#cc8855]'
                : stickerResult.sticker.obtained
                ? 'bg-[#0a2a1a] border-green-700 text-green-400'
                : 'bg-[#1a0a0a] border-red-800 text-red-400'
            }`}>
              {!stickerResult.found ? (
                <>
                  <span className="text-xl">❓</span>
                  <span>
                    Cromo <strong>{stickerResult.team}-{stickerResult.number}</strong> no está en tu lista de faltantes
                  </span>
                </>
              ) : stickerResult.sticker.obtained ? (
                <>
                  <span className="text-xl">✅</span>
                  <span>
                    <strong>{TEAM_FLAGS[stickerResult.sticker.team]} {TEAM_NAMES[stickerResult.sticker.team]} #{stickerResult.sticker.number}</strong> — ya lo tienes
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xl">❌</span>
                  <span>
                    <strong>{TEAM_FLAGS[stickerResult.sticker.team]} {TEAM_NAMES[stickerResult.sticker.team]} #{stickerResult.sticker.number}</strong> — aún te falta
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Buscador de equipo */}
        <div className="mb-6">
          <p className="text-[#89a8d4] text-xs mb-1">Buscar equipo</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={teamSearch}
              onChange={e => setTeamSearch(e.target.value)}
              placeholder="México, ESP, Francia..."
              className="flex-1 bg-[#0f1e3a] border border-[#1e3560] rounded-lg px-4 py-2 text-white placeholder-[#4a6a9a] focus:outline-none focus:border-[#E8600A] text-sm"
            />
            {teamSearch && (
              <button
                onClick={() => setTeamSearch('')}
                className="px-3 py-2 text-[#89a8d4] hover:text-white text-sm"
              >✕</button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#89a8d4] text-lg animate-pulse">Cargando cromos...</div>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {filteredTeams.map((code) => (
              <TeamCard
                key={code}
                teamCode={code}
                missingCount={missingByTeam[code]?.filter(s => !s.obtained).length ?? 0}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
