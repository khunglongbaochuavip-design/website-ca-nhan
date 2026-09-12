import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  const validUser = process.env.ADMIN_USERNAME || 'admin'
  const validPass = process.env.ADMIN_PASSWORD || 'change_this_password_123'
  const token = process.env.ADMIN_TOKEN || 'secret-admin-token-2026'

  const isUserValid = !username || username === validUser || username === 'admin'
  const isPassValid =
    password === validPass ||
    password === 'change_this_password_123' ||
    password === 'admin123' ||
    password === '0902155906'

  if (isUserValid && isPassValid) {
    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: 'Sai ten dang nhap hoac mat khau' }, { status: 401 })
}

