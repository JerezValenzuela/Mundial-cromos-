'use client'

import { useTheme } from '@/context/ThemeContext'

type Props = {
  totalMissing: number
  loading: boolean
}

const TOTAL_STICKERS = 682

export function Header({ totalMissing, loading }: Props) {
  const { theme, toggle } = useTheme()
  const obtained = TOTAL_STICKERS - totalMissing

  return (
    <header className="sticky top-0 z-50 border-b shadow-lg transition-colors"
      style={{ background: 'var(--navy)', borderColor: 'var(--navy2)' }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shadow"
            style={{ background: 'var(--accent)' }}>
            🏆
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight text-white">Panini FIFA 2026</h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>Álbum colaborativo</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!loading && (
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold" style={{ color: 'var(--accent2)' }}>
                  {totalMissing}
                </span>
                <span className="text-sm text-white opacity-70">faltan</span>
              </div>
              <div className="w-36 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(obtained / TOTAL_STICKERS) * 100}%`, background: 'var(--green)' }}
                />
              </div>
              <p className="text-xs opacity-50 text-white mt-0.5">{obtained} / {TOTAL_STICKERS}</p>
            </div>
          )}

          <button
            onClick={toggle}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}
