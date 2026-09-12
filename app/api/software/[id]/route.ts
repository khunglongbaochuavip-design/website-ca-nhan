import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { storeSoftwareById, storeSaveSoftware, storeDeleteSoftware } from '@/lib/store'
import type { Software } from '@/lib/supabase'

async function isAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  const expected = process.env.ADMIN_TOKEN || 'secret-admin-token-2026'
  return token?.value === expected
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await storeSoftwareById(id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  // Get existing or create new
  const existing = await storeSoftwareById(id)
  const updated: Software = {
    id,
    name: body.name ?? existing?.name ?? '',
    slug: body.slug ?? existing?.slug ?? '',
    description: body.description ?? existing?.description ?? '',
    content: body.content ?? existing?.content ?? '',
    version: body.version ?? existing?.version ?? '1.0.0',
    features: Array.isArray(body.features) ? body.features : (existing?.features ?? []),
    image_url: body.image_url ?? existing?.image_url ?? '',
    file_url: body.file_url ?? existing?.file_url ?? '',
    file_name: body.file_name ?? existing?.file_name ?? '',
    file_size: body.file_size ?? existing?.file_size ?? 0,
    download_count: existing?.download_count ?? 0,
    created_at: existing?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  await storeSaveSoftware(updated)
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await storeDeleteSoftware(id)
  return NextResponse.json({ success: true })
}
