'use client'

import Link from 'next/link'
import { TEAM_NAMES, TEAM_FLAGS } from '@/lib/stickerData'

type Props = { teamCode: string; missingCount: number; totalCount: number }

export function TeamCard({ teamCode, missingCount, totalCount }: Props) {
  const name = TEAM_NAMES[teamCode] ?? teamCode
  const flag = TEAM_FLAGS[teamCode] ?? '🏳️'
  const done = missingCount === 0
  const pct = totalCount > 0 ? ((totalCount - missingCount) / totalCount) * 100 : 100

  return (
    <Link href={`/team/${teamCode}`} className="block focus:outline-none">
      <div
        className="group flex flex-col items-center gap-2.5 rounded-3xl p-4 transition-all duration-300 cursor-pointer"
        style={{
          background: done ? 'var(--greenglass)' : 'var(--glass)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: `1px solid ${done ? 'var(--greenborder)' : 'var(--glass-border)'}`,
          boxShadow: done
            ? '0 4px 20px var(--greenglow), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'translateY(-4px) scale(1.03)'
          el.style.boxShadow = done
            ? '0 12px 30px var(--greenglow), inset 0 1px 0 rgba(255,255,255,0.15)'
            : '0 12px 30px var(--accentglow), inset 0 1px 0 rgba(255,255,255,0.12)'
          el.style.borderColor = done ? 'var(--green)' : 'rgba(255,107,26,0.5)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'translateY(0) scale(1)'
          el.style.boxShadow = done
            ? '0 4px 20px var(--greenglow), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.07)'
          el.style.borderColor = done ? 'var(--greenborder)' : 'var(--glass-border)'
        }}
      >
        <span className="text-3xl drop-shadow-sm leading-none">{flag}</span>

        <span
          className="text-xs font-semibold text-center leading-tight w-full truncate"
          style={{
            color: done ? 'var(--green)' : 'var(--text)',
            textDecoration: done ? 'line-through' : 'none',
            opacity: done ? 0.75 : 1,
          }}
        >
          {name}
        </span>

        {/* Progress arc */}
        <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: done
                ? 'linear-gradient(90deg, var(--green), #6ee7b7)'
                : 'linear-gradient(90deg, var(--accent), var(--gold))',
              boxShadow: done ? '0 0 6px var(--greenglow)' : '0 0 6px var(--accentglow)',
            }}
          />
        </div>

        {/* Badge */}
        <span
          className="text-xs font-bold px-2.5 py-0.5 rounded-full leading-tight"
          style={done
            ? { background: 'var(--greenglass)', color: 'var(--green)', border: '1px solid var(--greenborder)' }
            : { background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: 'white', boxShadow: '0 2px 8px var(--accentglow)' }
          }
        >
          {done ? '✓ Listo' : `${missingCount} faltan`}
        </span>
      </div>
    </Link>
  )
}
