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
  const [uploadingImage, setUploadingImage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

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
  })

  function slugify(t: string) {
    return t
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm((f) => ({ ...f, name, slug: isEdit ? f.slug : slugify(name) }))
  }

  function addFeature() {
    setForm((f) => ({ ...f, features: [...f.features, ''] }))
  }

  function updateFeature(i: number, v: string) {
    setForm((f) => ({ ...f, features: f.features.map((x, j) => (j === i ? v : x)) }))
  }

  function removeFeature(i: number) {
    setForm((f) => ({ ...f, features: f.features.filter((_, j) => j !== i) }))
  }

  // Upload image from computer directly to Vercel Blob
  async function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setErrorMessage('')
    try {
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })

      const json = await res.json()
      if (res.ok && json.url) {
        setForm((f) => ({ ...f, image_url: json.url }))
      } else {
        setErrorMessage('Không thể tải ảnh: ' + (json.error || 'Lỗi server'))
      }
    } catch {
      setErrorMessage('Lỗi kết nối khi tải ảnh lên.')
    } finally {
      setUploadingImage(false)
      // Reset input
      e.target.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    const body = {
      ...form,
      features: form.features.filter((f) => f.trim().length > 0),
      file_name: form.file_name || (form.file_url ? 'Bộ cài đặt phần mềm' : ''),
      file_size: 0,
    }

    const url = isEdit && software ? `/api/software/${software.id}` : '/api/software'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setSuccessMessage('✓ Đã lưu và cập nhật dữ liệu thành công!')
        setTimeout(() => {
          router.push('/admin/phan-mem')
          router.refresh()
        }, 800)
      } else {
        const err = await res.json().catch(() => ({}))
        setErrorMessage('Lỗi lưu dữ liệu: ' + (err?.error || res.statusText))
      }
    } catch {
      setErrorMessage('Lỗi kết nối mạng, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl flex items-center gap-3 shadow-sm animate-fade-in">
          <span className="text-xl">✅</span>
          <div className="font-medium text-sm">{successMessage}</div>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-300 text-rose-800 rounded-2xl flex items-center gap-3 shadow-sm">
          <span className="text-xl">⚠️</span>
          <div className="font-medium text-sm">{errorMessage}</div>
        </div>
      )}

      {/* Thông tin cơ bản */}
      <div className="bg-white rounded-3xl p-7 border border-neutral-200/80 shadow-sm space-y-5">
        <div className="border-b border-neutral-100 pb-3">
          <h3 className="font-bold text-lg text-neutral-900">1. Thông tin cơ bản phần mềm</h3>
          <p className="text-xs text-neutral-500 mt-0.5">Tên gọi, đường dẫn URL và mô tả tóm tắt</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              Tên phần mềm *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleNameChange}
              placeholder="VD: QBank Studio Pro 2026"
              required
              className="w-full px-4 py-3 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-950 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              Đường dẫn Slug (URL)
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="qbank-studio-pro-2026"
              className="w-full px-4 py-3 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-950 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              Phiên bản (Version)
            </label>
            <input
              type="text"
              value={form.version}
              onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
              placeholder="VD: 3.2.0"
              className="w-full px-4 py-3 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-950 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              Mô tả ngắn (Hiển thị ngoài danh sách)
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Tóm tắt ngắn 1-2 câu về công dụng nổi bật..."
              className="w-full px-4 py-3 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-950 text-sm resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Ảnh phần mềm (Hỗ trợ upload máy tính hoặc dán URL) */}
      <div className="bg-white rounded-3xl p-7 border border-neutral-200/80 shadow-sm space-y-4">
        <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-neutral-900">2. Hình ảnh đại diện phần mềm</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Tải ảnh từ máy tính hoặc dán đường link ảnh</p>
          </div>
          {uploadingImage && (
            <span className="text-xs font-semibold text-amber-600 animate-pulse flex items-center gap-1.5">
              <span>⏳</span> Đang tải ảnh lên đám mây...
            </span>
          )}
        </div>

        {form.image_url && (
          <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 max-h-64 flex items-center justify-center">
            <img src={form.image_url} alt="Preview" className="w-full h-full object-cover max-h-64" />
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, image_url: '' }))}
              className="absolute top-3 right-3 bg-neutral-900/80 text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-neutral-950 backdrop-blur-sm"
            >
              ✕ Gỡ ảnh
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-2xl cursor-pointer transition-colors bg-neutral-50/50 hover:bg-white text-center">
            <span className="text-2xl">📁</span>
            <span className="text-xs font-bold text-neutral-800">Tải ảnh từ máy tính</span>
            <span className="text-[11px] text-neutral-400">JPG, PNG, WEBP (Lưu trực tiếp lên đám mây)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              disabled={uploadingImage}
              className="hidden"
            />
          </label>

          <div className="flex flex-col justify-center space-y-2 p-5 bg-neutral-50/50 rounded-2xl border border-neutral-200/60">
            <label className="block text-xs font-bold text-neutral-700">Hoặc dán link ảnh trực tiếp (URL):</label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="https://images.unsplash.com/... hoặc link ảnh"
              className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-950 text-xs"
            />
            <span className="text-[10px] text-neutral-400">Hỗ trợ link Unsplash, Google Drive (direct), Imgur,...</span>
          </div>
        </div>
      </div>

      {/* Khung chứa Link phần mềm Google Drive */}
      <div className="bg-white rounded-3xl p-7 border border-neutral-200/80 shadow-sm space-y-4">
        <div className="border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔗</span>
            <h3 className="font-bold text-lg text-neutral-900">3. Đường dẫn tải phần mềm (Google Drive)</h3>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Chỉ cần tải bộ cài đặt lên Google Drive của bạn, bật quyền <strong>&quot;Bất kỳ ai có đường liên kết&quot;</strong>, sau đó dán link vào ô bên dưới.
          </p>
        </div>

        <div className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
              Link Google Drive / Dropbox / Mediafire / GitHub *
            </label>
            <div className="relative">
              <input
                type="url"
                value={form.file_url}
                onChange={(e) => setForm((f) => ({ ...f, file_url: e.target.value }))}
                placeholder="https://drive.google.com/file/d/1a2b3c.../view?usp=sharing"
                className="w-full pl-11 pr-4 py-3.5 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-950 text-sm font-mono text-neutral-900 placeholder-neutral-400"
              />
              <span className="absolute left-3.5 top-3.5 text-lg">💾</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
              Tên file hiển thị (Tùy chọn)
            </label>
            <input
              type="text"
              value={form.file_name}
              onChange={(e) => setForm((f) => ({ ...f, file_name: e.target.value }))}
              placeholder="VD: QBank_Studio_Pro_v3.2.zip"
              className="w-full px-4 py-3 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-950 text-sm font-medium"
            />
          </div>

          {form.file_url && (
            <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="text-xl flex-shrink-0">🚀</span>
                <div className="truncate">
                  <div className="text-xs font-bold text-amber-900">Link tải đã sẵn sàng cho khách hàng</div>
                  <div className="text-[11px] text-amber-700 truncate font-mono">{form.file_url}</div>
                </div>
              </div>
              <a
                href={form.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-amber-900 underline flex-shrink-0 hover:text-black"
              >
                Kiểm tra link ↗
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Tính năng nổi bật */}
      <div className="bg-white rounded-3xl p-7 border border-neutral-200/80 shadow-sm space-y-4">
        <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-neutral-900">4. Danh sách tính năng nổi bật</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Các gạch đầu dòng tính năng hiển thị trên trang chi tiết</p>
          </div>
          <button
            type="button"
            onClick={addFeature}
            className="text-xs font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            + Thêm tính năng
          </button>
        </div>

        <div className="space-y-3">
          {form.features.map((feat: string, i: number) => (
            <div key={i} className="flex gap-2.5 items-center">
              <span className="text-xs font-bold text-neutral-400 w-6 text-center">{i + 1}.</span>
              <input
                type="text"
                value={feat}
                onChange={(e) => updateFeature(i, e.target.value)}
                placeholder={`Tính năng nổi bật thứ ${i + 1}...`}
                className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-950 text-sm"
              />
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Xóa"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Nội dung giới thiệu chi tiết (HTML) */}
      <div className="bg-white rounded-3xl p-7 border border-neutral-200/80 shadow-sm space-y-3">
        <div className="border-b border-neutral-100 pb-3">
          <h3 className="font-bold text-lg text-neutral-900">5. Nội dung giới thiệu & Hướng dẫn (HTML)</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Soạn thảo chi tiết để giới thiệu sâu về phần mềm. Có thể viết văn bản thông thường hoặc chèn thẻ HTML (h3, h4, p, ul, li, strong).
          </p>
        </div>

        <textarea
          rows={12}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          placeholder="Nhập nội dung giới thiệu chi tiết về phần mềm..."
          className="w-full p-4 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-y font-mono text-xs leading-relaxed"
        />
      </div>

      {/* Hành động */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="bg-neutral-950 text-white px-9 py-4 rounded-2xl font-bold text-sm hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-lg shadow-black/10 cursor-pointer flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>Đang lưu lên máy chủ...</span>
            </>
          ) : isEdit ? (
            <>
              <span>💾</span>
              <span>Lưu Cập Nhật</span>
            </>
          ) : (
            <>
              <span>➕</span>
              <span>Thêm Phần Mềm Mới</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push('/admin/phan-mem')}
          className="px-8 py-4 border border-neutral-300 rounded-2xl font-semibold text-sm hover:bg-neutral-100 transition-colors cursor-pointer text-neutral-700"
        >
          Hủy bỏ
        </button>

        {successMessage && (
          <span className="text-emerald-700 font-semibold text-sm flex items-center gap-1.5 animate-pulse">
            {successMessage}
          </span>
        )}
      </div>
    </form>
  )
}
