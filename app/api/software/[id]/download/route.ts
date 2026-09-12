import { NextRequest, NextResponse } from 'next/server'
import { storeSoftwareById, storeSaveSoftware } from '@/lib/store'

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sw = await storeSoftwareById(id)
  if (sw) {
    await storeSaveSoftware({ ...sw, download_count: (sw.download_count || 0) + 1 })
  }
  return NextResponse.json({ success: true })
}
