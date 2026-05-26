'use client'

import Link from 'next/link'
import { TEAM_NAMES, TEAM_FLAGS } from '@/lib/stickerData'

type Props = {
  teamCode: string
  missingCount: number
}

export function TeamCard({ teamCode, missingCount }: Props) {
  const name = TEAM_NAMES[teamCode] ?? teamCode
  const flag = TEAM_FLAGS[teamCode] ?? '🏳️'
  const done = missingCount === 0

  return (
    <Link href={done ? '#' : `/team/${teamCode}`}>
      <div
        className={`flex flex-col items-center gap-2 rounded-xl p-4 border transition-all duration-200 cursor-pointer
          ${done
            ? 'bg-[#0a2a1a] border-green-700 opacity-70'
            : 'bg-[#0f1e3a] border-[#1e3560] hover:border-[#E8600A] hover:scale-[1.02]'
          }`}
      >
        <span className="text-3xl">{flag}</span>
        <span
          className={`text-sm font-semibold text-center leading-tight ${done ? 'line-through text-green-400' : 'text-white'}`}
        >
          {name}
        </span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${done ? 'bg-green-800 text-green-300' : 'bg-[#E8600A] text-white'}`}
        >
          {done ? '✓ Completo' : `${missingCount} faltan`}
        </span>
      </div>
    </Link>
  )
}
