'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteSoftwareButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Ban co chac muon xoa "' + name + '"?')) return
    setLoading(true)
    await fetch('/api/software/' + id, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-100 transition-colors disabled:opacity-60 cursor-pointer">
      {loading ? '...' : 'Xoa'}
    </button>
  )
}
