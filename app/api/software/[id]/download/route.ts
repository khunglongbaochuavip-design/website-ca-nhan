import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: sw } = await supabase.from('software').select('download_count').eq('id', id).single()
  await supabase.from('software').update({ download_count: (sw?.download_count || 0) + 1 }).eq('id', id)
  return NextResponse.json({ success: true })
}
