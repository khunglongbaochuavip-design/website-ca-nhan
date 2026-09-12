import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { storeBlogList, storeSaveBlog } from '@/lib/store'
import type { BlogPost } from '@/lib/supabase'

async function isAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  const expected = process.env.ADMIN_TOKEN || 'secret-admin-token-2026'
  return token?.value === expected
}

export async function GET() {
  const list = await storeBlogList()
  return NextResponse.json(list)
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const now = new Date().toISOString()
  const item: BlogPost = {
    id: Date.now().toString(),
    title: body.title || '',
    slug: body.slug || '',
    content: body.content || '',
    cover_image: body.cover_image || '',
    published: body.published ?? false,
    created_at: now,
    updated_at: now,
  }
  await storeSaveBlog(item)
  return NextResponse.json(item, { status: 201 })
}
