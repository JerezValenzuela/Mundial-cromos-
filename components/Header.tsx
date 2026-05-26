'use client'

type Props = {
  totalMissing: number
  loading: boolean
}

const TOTAL_STICKERS = 682

export function Header({ totalMissing, loading }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-[#1A3A6B] border-b border-[#2a5099] shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">
              Panini FIFA 2026
            </h1>
            <p className="text-[#89a8d4] text-xs">Álbum colaborativo</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          {loading ? (
            <span className="text-[#89a8d4] text-sm">Cargando...</span>
          ) : (
            <>
              <span className="text-[#E8600A] font-bold text-lg leading-tight">
                {totalMissing} faltan
              </span>
              <span className="text-[#89a8d4] text-xs">
                de {TOTAL_STICKERS} totales
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
