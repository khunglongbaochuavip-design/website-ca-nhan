import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { storeBlogById, storeSaveBlog, storeDeleteBlog } from '@/lib/store'
import type { BlogPost } from '@/lib/supabase'

async function isAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  const expected = process.env.ADMIN_TOKEN || 'secret-admin-token-2026'
  return token?.value === expected
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await storeBlogById(id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  const existing = await storeBlogById(id)
  const updated: BlogPost = {
    id,
    title: body.title ?? existing?.title ?? '',
    slug: body.slug ?? existing?.slug ?? '',
    content: body.content ?? existing?.content ?? '',
    cover_image: body.cover_image ?? existing?.cover_image ?? '',
    published: body.published ?? existing?.published ?? false,
    created_at: existing?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  await storeSaveBlog(updated)
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await storeDeleteBlog(id)
  return NextResponse.json({ success: true })
}
