'use client'

export const dynamic = 'force-dynamic'

import { useStickers } from '@/hooks/useStickers'
import { TeamCard } from '@/components/TeamCard'
import { Header } from '@/components/Header'
import { TEAM_ORDER } from '@/lib/stickerData'

export default function HomePage() {
  const { missingByTeam, totalMissing, loading } = useStickers()

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Header totalMissing={totalMissing} loading={loading} />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#89a8d4] text-lg animate-pulse">Cargando cromos...</div>
          </div>
        ) : (
          <>
            <p className="text-[#89a8d4] text-sm mb-6">
              Toca un equipo para ver qué cromos faltan y marcarlos como conseguidos.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {TEAM_ORDER.map((code) => (
                <TeamCard
                  key={code}
                  teamCode={code}
                  missingCount={missingByTeam[code]?.length ?? 0}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
