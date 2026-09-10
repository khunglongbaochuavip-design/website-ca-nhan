import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  const validUser = process.env.ADMIN_USERNAME || 'admin'
  const validPass = process.env.ADMIN_PASSWORD || 'admin123'
  const token = process.env.ADMIN_TOKEN || 'super-secret-token-change-this'

  if (username === validUser && password === validPass) {
    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: 'Sai ten dang nhap hoac mat khau' }, { status: 401 })
}
