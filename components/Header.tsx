'use client'

import { useTheme } from '@/context/ThemeContext'

type Props = { totalMissing: number; loading: boolean }

const TOTAL = 682

export function Header({ totalMissing, loading }: Props) {
  const { theme, toggle } = useTheme()
  const obtained = TOTAL - totalMissing
  const pct = (obtained / TOTAL) * 100

  return (
    <header className="sticky top-0 z-50 border-b"
      style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%)',
        borderColor: 'rgba(255,255,255,0.08)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(12px)',
      }}>
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--gold) 100%)' }}>
            🏆
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-tight">Panini FIFA 2026</h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Álbum colaborativo</p>
          </div>
        </div>

        {/* Progress + toggle */}
        <div className="flex items-center gap-3">
          {!loading && (
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black leading-none" style={{ color: 'var(--accent2)' }}>
                  {totalMissing}
                </span>
                <span className="text-xs font-medium text-white opacity-60">faltan</span>
              </div>
              <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, var(--green) 0%, #4ade80 100%)',
                    boxShadow: '0 0 8px rgba(34,197,94,0.6)',
                  }} />
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{obtained} / {TOTAL}</p>
            </div>
          )}

          <button onClick={toggle}
            className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-all duration-200 hover:scale-110 hover:opacity-90"
            style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}
