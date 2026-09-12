'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteSoftwareButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Bạn có chắc muốn xóa "' + name + '"?')) return
    setLoading(true)
    const res = await fetch('/api/software/' + id, { method: 'DELETE' })
    if (!res.ok) {
      alert('Lỗi xóa phần mềm')
    }
    router.refresh()
    setLoading(false)
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-60 cursor-pointer">
      {loading ? '...' : 'Xóa'}
    </button>
  )
}
