'use client'

import Link from 'next/link'
import { TEAM_NAMES, TEAM_FLAGS } from '@/lib/stickerData'

type Props = {
  teamCode: string
  missingCount: number
  totalCount: number
}

export function TeamCard({ teamCode, missingCount, totalCount }: Props) {
  const name = TEAM_NAMES[teamCode] ?? teamCode
  const flag = TEAM_FLAGS[teamCode] ?? '🏳️'
  const done = missingCount === 0
  const obtained = totalCount - missingCount
  const pct = totalCount > 0 ? (obtained / totalCount) * 100 : 100

  return (
    <Link href={`/team/${teamCode}`}>
      <div
        className="flex flex-col items-center gap-2 rounded-2xl p-3 border transition-all duration-200 cursor-pointer hover:scale-[1.03] hover:shadow-lg"
        style={{
          background: done ? 'var(--green-bg)' : 'var(--bg2)',
          borderColor: done ? 'var(--green-b)' : 'var(--border)',
        }}
        onMouseEnter={e => {
          if (!done) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'
        }}
        onMouseLeave={e => {
          if (!done) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
        }}
      >
        <span className="text-3xl leading-none">{flag}</span>
        <span
          className="text-xs font-semibold text-center leading-tight"
          style={{ color: done ? 'var(--green)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}
        >
          {name}
        </span>

        <div className="w-full">
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: done ? 'var(--green)' : 'var(--accent)',
              }}
            />
          </div>
        </div>

        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: done ? 'var(--green)' : 'var(--accent)',
            color: 'white',
          }}
        >
          {done ? '✓ Listo' : `${missingCount} faltan`}
        </span>
      </div>
    </Link>
  )
}
