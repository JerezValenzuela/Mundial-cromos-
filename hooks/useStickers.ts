'use client'

import { useEffect, useState, useCallback } from 'react'
import { getSupabase, Sticker } from '@/lib/supabase'

export function useStickers() {
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStickers = useCallback(async () => {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('stickers')
      .select('*')
      .eq('obtained', false)
      .order('team')
      .order('number')

    if (!error && data) {
      setStickers(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const supabase = getSupabase()
    fetchStickers()

    const channel = supabase
      .channel('stickers-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stickers' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Sticker
            if (updated.obtained) {
              setStickers((prev) => prev.filter((s) => s.id !== updated.id))
            } else {
              setStickers((prev) =>
                prev.some((s) => s.id === updated.id)
                  ? prev.map((s) => (s.id === updated.id ? updated : s))
                  : [...prev, updated]
              )
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchStickers])

  const markObtained = useCallback(async (id: string) => {
    const supabase = getSupabase()
    await supabase
      .from('stickers')
      .update({
        obtained: true,
        obtained_at: new Date().toISOString(),
      })
      .eq('id', id)
  }, [])

  const missingByTeam = stickers.reduce<Record<string, Sticker[]>>((acc, s) => {
    if (!acc[s.team]) acc[s.team] = []
    acc[s.team].push(s)
    return acc
  }, {})

  const totalMissing = stickers.length

  return { stickers, missingByTeam, totalMissing, loading, markObtained }
}
