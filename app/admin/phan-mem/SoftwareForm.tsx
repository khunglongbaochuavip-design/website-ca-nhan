'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Software } from '@/lib/supabase'

interface SoftwareFormProps {
  software?: Software
  isEdit?: boolean
}

export default function SoftwareForm({ software, isEdit }: SoftwareFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [form, setForm] = useState({
    name: software?.name || '',
    slug: software?.slug || '',
    description: software?.description || '',
    content: software?.content || '',
    version: software?.version || '1.0.0',
    features: software?.features?.length ? software.features : [''],
    image_url: software?.image_url || '',
    file_url: software?.file_url || '',
    file_name: software?.file_name || '',
    file_size: software?.file_size || 0,
  })

  function slugify(t: string) {
    return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,'').trim().replace(/\s+/g,'-')
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm((f) => ({ ...f, name, slug: isEdit ? f.slug : slugify(name) }))
  }

  function addFeature() {
    setForm((f) => ({ ...f, features: [...f.features, ''] }))
  }

  function updateFeature(i: number, v: string) {
    setForm((f) => ({ ...f, features: f.features.map((x, j) => j === i ? v : x) }))
  }

  function removeFeature(i: number) {
    setForm((f) => ({ ...f, features: f.features.filter((_, j) => j !== i) }))
  }

  async function uploadToR2(file: File, prefix: string) {
    const presignRes = await fetch('/api/r2/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: prefix + file.name, contentType: file.type || 'application/octet-stream' }),
    })
    const { url, publicUrl } = await presignRes.json()
    return { url, publicUrl }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setUploadProgress(0)
    try {
      const { url, publicUrl } = await uploadToR2(file, '')
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (ev: ProgressEvent) => {
          if (ev.lengthComputable) setUploadProgress(Math.round((ev.loaded / ev.total) * 100))
        }
        xhr.onload = () => resolve()
        xhr.onerror = () => reject()
        xhr.open('PUT', url)
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
        xhr.send(file)
      })
      setForm((f) => ({ ...f, file_url: publicUrl, file_name: file.name, file_size: file.size }))
      setUploadProgress(100)
    } catch {
      alert('Loi upload file.')
    }
    setLoading(false)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const { url, publicUrl } = await uploadToR2(file, 'images/')
      const xhr = new XMLHttpRequest()
      await new Promise<void>((res, rej) => {
        xhr.onload = () => res()
        xhr.onerror = () => rej()
        xhr.open('PUT', url)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })
      setForm((f) => ({ ...f, image_url: publicUrl }))
    } catch {
      alert('Loi upload anh.')
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const body = { ...form, features: form.features.filter(Boolean) }
    const url = isEdit && software ? '/api/software/' + software.id : '/api/software'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) router.push('/admin/phan-mem')
    else alert('Loi luu du lieu')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 space-y-4">
        <h3 className="font-semibold text-lg">Thong tin co ban</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">Ten phan mem *</label>
            <input type="text" value={form.name} onChange={handleNameChange} required
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Slug (URL)</label>
            <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Phien ban</label>
            <input type="text" value={form.version} onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">Mo ta ngan</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-semibold text-lg mb-4">Anh phan mem</h3>
        {form.image_url && (
          <div className="mb-4 relative">
            <img src={form.image_url} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" />
            <button type="button" onClick={() => setForm((f) => ({ ...f, image_url: '' }))}
              className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80">
              &#10005;
            </button>
          </div>
        )}
        <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-neutral-200 rounded-xl cursor-pointer hover:border-black transition-colors">
          <span className="text-3xl">&#128444;</span>
          <span className="text-sm text-neutral-500">Chon anh (JPG, PNG, WEBP)</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-semibold text-lg mb-4">File phan mem (.ZIP / .RAR)</h3>
        {form.file_name && (
          <div className="mb-4 flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
            <span className="text-2xl">&#128230;</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{form.file_name}</p>
              <p className="text-xs text-neutral-400">{form.file_size > 0 ? (form.file_size / 1024 / 1024).toFixed(1) + ' MB' : ''}</p>
            </div>
            <button type="button" onClick={() => setForm((f) => ({ ...f, file_url: '', file_name: '', file_size: 0 }))}
              className="text-neutral-400 hover:text-red-500 cursor-pointer">&#10005;</button>
          </div>
        )}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1"><span>Dang upload...</span><span>{uploadProgress}%</span></div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div className="bg-black h-2 rounded-full transition-all" style={{ width: uploadProgress + '%' }} />
            </div>
          </div>
        )}
        {uploadProgress === 100 && <p className="text-green-600 text-sm mb-4">&#10003; Upload thanh cong!</p>}
        <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-neutral-200 rounded-xl cursor-pointer hover:border-black transition-colors">
          <span className="text-3xl">&#128228;</span>
          <span className="text-sm text-neutral-500">Chon file .ZIP hoac .RAR (toi da 500MB+)</span>
          <input type="file" accept=".zip,.rar,.7z,.exe,.msi" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Tinh nang noi bat</h3>
          <button type="button" onClick={addFeature} className="text-sm text-neutral-500 hover:text-black cursor-pointer">+ Them</button>
        </div>
        <div className="space-y-2">
          {form.features.map((feat: string, i: number) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={feat} onChange={(e) => updateFeature(i, e.target.value)}
                placeholder={"Tinh nang " + (i + 1)}
                className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black" />
              <button type="button" onClick={() => removeFeature(i)} className="p-2.5 text-neutral-400 hover:text-red-500 cursor-pointer">&#10005;</button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-neutral-200">
        <h3 className="font-semibold text-lg mb-4">Noi dung gioi thieu (HTML)</h3>
        <textarea rows={8} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          placeholder="Nhap noi dung HTML hoac de trong..."
          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-y font-mono text-sm" />
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading}
          className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 disabled:opacity-60 transition-opacity cursor-pointer">
          {loading ? 'Dang luu...' : isEdit ? 'Cap nhat' : 'Them moi'}
        </button>
        <button type="button" onClick={() => router.push('/admin/phan-mem')}
          className="px-8 py-3 border border-neutral-200 rounded-xl font-medium hover:bg-neutral-50 transition-colors cursor-pointer">
          Huy
        </button>
      </div>
    </form>
  )
}
