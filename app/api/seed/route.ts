import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { MISSING_STICKERS } from '@/lib/stickerData'

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { count } = await supabase
    .from('stickers')
    .select('*', { count: 'exact', head: true })

  if (count && count > 0) {
    return NextResponse.json({ message: 'Already seeded', count })
  }

  const rows = MISSING_STICKERS.map(({ team, number }) => ({
    id: `${team}-${number}`,
    team,
    number,
    obtained: false,
    obtained_by: null,
    obtained_at: null,
  }))

  const { error } = await supabase.from('stickers').insert(rows)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Seeded successfully', inserted: rows.length })
}
