import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  const expected = process.env.ADMIN_TOKEN || 'secret-admin-token-2026'
  return token?.value === expected
}


export async function GET() {
  const { data, error } = await supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { data, error } = await supabase.from('blog_posts').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
