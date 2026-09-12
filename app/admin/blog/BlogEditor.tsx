'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import type { BlogPost } from '@/lib/supabase'
import { cleanSlug } from '@/lib/utils'

interface ToolbarButtonProps {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, active = false, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={
        'p-2 rounded-xl transition-colors text-sm font-medium cursor-pointer ' +
        (active ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100 text-neutral-700')
      }
    >
      {children}
    </button>
  )
}

function slugify(t: string) {
  return t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

interface BlogEditorProps {
  post?: BlogPost
  isEdit?: boolean
}

export default function BlogEditor({ post, isEdit }: BlogEditorProps = {}) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(cleanSlug(post?.slug || post?.title || ''))
  const [coverImage, setCoverImage] = useState(post?.cover_image || '')
  const [published, setPublished] = useState(post?.published || false)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [preview, setPreview] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: post?.content || '<p>Bắt đầu viết bài chia sẻ chuyên môn...</p>',
    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[420px] focus:outline-none px-4 py-3 leading-relaxed text-neutral-800',
      },
    },
  })

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const t = e.target.value
    setTitle(t)
    if (!isEdit) setSlug(cleanSlug(t))
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
        setCoverImage(json.url)
      } else {
        setErrorMessage('Lỗi upload ảnh bìa: ' + (json.error || 'Thất bại'))
      }
    } catch {
      setErrorMessage('Lỗi kết nối khi tải ảnh.')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  function addImage() {
    const url = prompt('Nhập URL hình ảnh muốn chèn:')
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }

  function addLink() {
    const url = prompt('Nhập đường dẫn liên kết (URL):')
    if (url) editor?.chain().focus().setLink({ href: url }).run()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    const body = {
      title,
      slug: cleanSlug(slug || title) || post?.id || Date.now().toString(),
      content: editor?.getHTML() || '',
      cover_image: coverImage,
      published,
    }

    const url = isEdit && post ? `/api/blog/${post.id}` : '/api/blog'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setSuccessMessage('✓ Đã lưu bài viết thành công lên máy chủ!')
        setTimeout(() => {
          router.push('/admin/blog')
          router.refresh()
        }, 800)
      } else {
        const err = await res.json().catch(() => ({}))
        setErrorMessage('Lỗi lưu bài viết: ' + (err?.error || res.statusText))
      }
    } catch {
      setErrorMessage('Lỗi kết nối mạng, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
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

      {/* Title Input */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
          Tiêu đề bài viết *
        </label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Nhập tiêu đề bài viết bài bản..."
          required
          className="w-full text-2xl sm:text-3xl font-bold bg-transparent border-0 border-b border-neutral-200 focus:outline-none focus:border-neutral-900 pb-3 placeholder-neutral-300 font-serif"
        />
      </div>

      {/* Slug & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            Đường dẫn Slug (URL)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(cleanSlug(e.target.value))}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-mono"
          />
          <p className="text-[11px] text-neutral-500 mt-1 font-mono truncate">
            🌐 Xem thử: /blog/<span className="font-bold text-neutral-800">{cleanSlug(slug || title) || 'tieu-de-bai-viet'}</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-neutral-900">Trạng thái phát hành</div>
            <div className="text-xs text-neutral-400 mt-0.5">
              {published ? 'Hiển thị công khai cho mọi độc giả' : 'Lưu ở chế độ bản nháp nội bộ'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={
              'relative inline-flex h-7 w-14 items-center rounded-full transition-colors cursor-pointer ' +
              (published ? 'bg-emerald-600' : 'bg-neutral-300')
            }
          >
            <span
              className={
                'inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ' +
                (published ? 'translate-x-8' : 'translate-x-1')
              }
            />
          </button>
        </div>
      </div>

      {/* Cover Image */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-neutral-900">Ảnh bìa bài viết</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Tải ảnh từ máy tính hoặc dán link</p>
          </div>
          {uploadingImage && (
            <span className="text-xs text-amber-600 font-semibold animate-pulse">
              ⏳ Đang tải ảnh lên...
            </span>
          )}
        </div>

        {coverImage && (
          <div className="relative rounded-2xl overflow-hidden border border-neutral-200 max-h-52 bg-neutral-100">
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover max-h-52" />
            <button
              type="button"
              onClick={() => setCoverImage('')}
              className="absolute top-3 right-3 bg-neutral-900/80 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-neutral-950 backdrop-blur-sm"
            >
              ✕ Gỡ ảnh
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center justify-center gap-2.5 p-4 border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-2xl cursor-pointer transition-colors bg-neutral-50/50 hover:bg-white text-center">
            <span className="text-xl">📁</span>
            <span className="text-xs font-bold text-neutral-800">Chọn ảnh bìa từ máy tính</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={uploadingImage}
              className="hidden"
            />
          </label>

          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Hoặc dán URL ảnh bìa trực tiếp: https://..."
            className="w-full px-4 py-3 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs self-center"
          />
        </div>
      </div>

      {/* TipTap Rich Text Editor */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 p-3.5 border-b border-neutral-200 bg-neutral-50/70">
          <ToolbarButton onClick={() => editor?.chain().focus().undo().run()} title="Hoàn tác">
            ↩ Hoàn tác
          </ToolbarButton>
          <ToolbarButton onClick={() => editor?.chain().focus().redo().run()} title="Làm lại">
            ↪ Làm lại
          </ToolbarButton>
          <div className="w-px h-5 bg-neutral-200 mx-1" />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor?.isActive('heading', { level: 1 })}
            title="Tiêu đề lớn H1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor?.isActive('heading', { level: 2 })}
            title="Tiêu đề mục H2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor?.isActive('heading', { level: 3 })}
            title="Tiêu đề nhỏ H3"
          >
            H3
          </ToolbarButton>
          <div className="w-px h-5 bg-neutral-200 mx-1" />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            active={editor?.isActive('bold')}
            title="In đậm"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            active={editor?.isActive('italic')}
            title="In nghiêng"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            active={editor?.isActive('underline')}
            title="Gạch chân"
          >
            <u>U</u>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            active={editor?.isActive('strike')}
            title="Gạch ngang"
          >
            <s>S</s>
          </ToolbarButton>
          <div className="w-px h-5 bg-neutral-200 mx-1" />
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
            active={editor?.isActive({ textAlign: 'left' })}
            title="Căn trái"
          >
            ⬅
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
            active={editor?.isActive({ textAlign: 'center' })}
            title="Căn giữa"
          >
            ↔
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
            active={editor?.isActive({ textAlign: 'right' })}
            title="Căn phải"
          >
            ➡
          </ToolbarButton>
          <div className="w-px h-5 bg-neutral-200 mx-1" />
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            active={editor?.isActive('bulletList')}
            title="Danh sách gạch đầu dòng"
          >
            • Danh sách
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            active={editor?.isActive('orderedList')}
            title="Danh sách số"
          >
            1. Số
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            active={editor?.isActive('blockquote')}
            title="Trích dẫn"
          >
            ❝ Trích dẫn
          </ToolbarButton>
          <div className="w-px h-5 bg-neutral-200 mx-1" />
          <ToolbarButton onClick={addLink} title="Chèn liên kết">
            🔗 Link
          </ToolbarButton>
          <ToolbarButton onClick={addImage} title="Chèn ảnh theo URL">
            🖼 Ảnh
          </ToolbarButton>
          <div className="flex-1" />
          <ToolbarButton onClick={() => setPreview(!preview)} title="Xem thử">
            {preview ? '✏️ Tiếp tục soạn' : '👁 Xem thử'}
          </ToolbarButton>
        </div>

        {preview ? (
          <div className="p-8 bg-white min-h-[420px]">
            <div
              className="prose max-w-none font-serif"
              dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
            />
          </div>
        ) : (
          <div className="p-6 bg-white min-h-[420px]">
            <EditorContent editor={editor} />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="bg-neutral-950 text-white px-9 py-4 rounded-2xl font-bold text-sm hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-lg shadow-black/10 cursor-pointer flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>Đang lưu...</span>
            </>
          ) : isEdit ? (
            <>
              <span>💾</span>
              <span>Cập Nhật Bài Viết</span>
            </>
          ) : (
            <>
              <span>✍️</span>
              <span>Đăng Bài Mới</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push('/admin/blog')}
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
