'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error || 'Dang nhap that bai')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-neutral-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{fontFamily:'Georgia,serif'}}>Admin</h1>
          <p className="text-neutral-500 text-sm">Dang nhap de quan ly noi dung</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ten dang nhap</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="admin" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mat khau</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer">
            {loading ? 'Dang dang nhap...' : 'Dang nhap'}
          </button>
        </form>
      </div>
    </div>
  )
}
