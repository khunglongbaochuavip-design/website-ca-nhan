'use client'
import { useState } from 'react'

export default function DownloadButton({
  softwareId,
  fileUrl,
  fileName,
}: {
  softwareId: string
  fileUrl: string
  fileName: string
}) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      await fetch('/api/software/' + softwareId + '/download', { method: 'POST' })
      window.open(fileUrl, '_blank')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-2xl font-medium hover:opacity-90 transition-opacity disabled:opacity-60 text-lg cursor-pointer"
    >
      <span>&#11015;</span> {loading ? 'Dang xu ly...' : 'Tai ve'}
    </button>
  )
}
