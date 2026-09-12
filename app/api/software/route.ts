import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { storeSoftwareList, storeSaveSoftware } from '@/lib/store'
import type { Software } from '@/lib/supabase'

async function isAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  const expected = process.env.ADMIN_TOKEN || 'secret-admin-token-2026'
  return token?.value === expected
}

export async function GET() {
  const list = await storeSoftwareList()
  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const now = new Date().toISOString()
  const item: Software = {
    id: Date.now().toString(),
    name: body.name || '',
    slug: body.slug || '',
    description: body.description || '',
    content: body.content || '',
    version: body.version || '1.0.0',
    features: Array.isArray(body.features) ? body.features : [],
    image_url: body.image_url || '',
    file_url: body.file_url || '',
    file_name: body.file_name || '',
    file_size: body.file_size || 0,
    download_count: 0,
    created_at: now,
    updated_at: now,
  }
  await storeSaveSoftware(item)
  return NextResponse.json(item, { status: 201 })
}
