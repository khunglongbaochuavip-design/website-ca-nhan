import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { cookies } from 'next/headers'

async function isAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  const expected = process.env.ADMIN_TOKEN || 'secret-admin-token-2026'
  return token?.value === expected
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file tải lên' }, { status: 400 })
    }

    // Clean file name
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `uploads/${Date.now()}-${sanitizedName}`

    const blob = await put(path, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type || 'application/octet-stream',
      token: process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_QJgUUYfbZYNvd44K_lnwHMxgBHH6L3N3nPoIpKoAagnG6JA',
    })

    return NextResponse.json({ url: blob.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi upload ảnh'
    console.error('Upload error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
