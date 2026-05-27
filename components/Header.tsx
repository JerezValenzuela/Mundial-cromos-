'use client'

import { useTheme } from '@/contexts/ThemeContext'

type Props = { totalMissing: number; loading: boolean }
const TOTAL = 682

export function Header({ totalMissing, loading }: Props) {
  const { theme, toggleTheme } = useTheme()
  const obtained = TOTAL - totalMissing
  const pct = Math.round((obtained / TOTAL) * 100)

  return (
    <header className="sticky top-0 z-50 flex justify-center px-4 py-3">
      <div
        className="glass w-full max-w-4xl rounded-2xl px-5 py-3 flex items-center justify-between gap-4"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px var(--glass-border)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-lg shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--gold))' }}
          >
            🏆
          </div>
          <div className="hidden sm:block">
            <p className="font-bold text-sm leading-tight" style={{ color: 'var(--text)' }}>Panini FIFA 2026</p>
            <p className="text-xs" style={{ color: 'var(--text3)' }}>Álbum colaborativo</p>
          </div>
        </div>

        {/* Progress pill */}
        {!loading && (
          <div className="flex-1 max-w-xs hidden sm:block">
            <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text2)' }}>
              <span>{obtained} conseguidos</span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{totalMissing} faltan</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, var(--accent), var(--gold))',
                  boxShadow: '0 0 10px var(--accentglow)',
                }}
              />
            </div>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!loading && (
            <div className="text-right">
              <p className="font-black text-xl leading-none" style={{ color: 'var(--accent)' }}>{totalMissing}</p>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>/ {TOTAL}</p>
            </div>
          )}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-200 hover:scale-110"
            style={{ background: 'var(--pill-bg)', border: '1px solid var(--pill-border)' }}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}
