'use client'

import Link from 'next/link'
import { TEAM_NAMES, TEAM_FLAGS } from '@/lib/stickerData'

type Props = { teamCode: string; missingCount: number; totalCount: number }

export function TeamCard({ teamCode, missingCount, totalCount }: Props) {
  const name = TEAM_NAMES[teamCode] ?? teamCode
  const flag = TEAM_FLAGS[teamCode] ?? '🏳️'
  const done = missingCount === 0
  const obtained = totalCount - missingCount
  const pct = totalCount > 0 ? (obtained / totalCount) * 100 : 100

  return (
    <Link href={`/team/${teamCode}`}>
      <div
        className="group flex flex-col items-center gap-2 rounded-2xl p-3 border transition-all duration-250 cursor-pointer"
        style={{
          background: done
            ? 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.06))'
            : 'var(--bg2)',
          borderColor: done ? 'var(--greenb)' : 'var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = done ? 'var(--green)' : 'var(--accent)'
          el.style.transform = 'translateY(-2px) scale(1.02)'
          el.style.boxShadow = done ? '0 8px 24px rgba(34,197,94,0.2)' : '0 8px 24px rgba(249,115,22,0.2)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = done ? 'var(--greenb)' : 'var(--border)'
          el.style.transform = 'translateY(0) scale(1)'
          el.style.boxShadow = 'var(--shadow-sm)'
        }}
      >
        <span className="text-3xl leading-none drop-shadow">{flag}</span>

        <span className="text-xs font-semibold text-center leading-tight w-full truncate"
          style={{
            color: done ? 'var(--green)' : 'var(--text)',
            textDecoration: done ? 'line-through' : 'none',
            opacity: done ? 0.7 : 1,
          }}>
          {name}
        </span>

        {/* Mini progress bar */}
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: done
                ? 'var(--green)'
                : 'linear-gradient(90deg, var(--accent), var(--accent2))',
            }} />
        </div>

        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
          style={{
            background: done ? 'var(--green)' : 'linear-gradient(135deg, var(--accent), var(--accent2))',
            color: 'white',
            boxShadow: done ? '0 2px 8px rgba(34,197,94,0.35)' : '0 2px 8px rgba(249,115,22,0.35)',
          }}>
          {done ? '✓ Listo' : `${missingCount} faltan`}
        </span>
      </div>
    </Link>
  )
}
