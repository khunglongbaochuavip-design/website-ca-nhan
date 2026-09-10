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

interface ToolbarButtonProps {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, active = false, title, children }: ToolbarButtonProps) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={"p-2 rounded-lg transition-colors text-sm cursor-pointer " + (active ? 'bg-black text-white' : 'hover:bg-neutral-100 text-neutral-700')}>
      {children}
    </button>
  )
}

function slugify(t: string) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,'').trim().replace(/\s+/g,'-')
}

interface BlogEditorProps {
  post?: BlogPost
  isEdit?: boolean
}

export default function BlogEditor({ post, isEdit }: BlogEditorProps = {}) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [coverImage, setCoverImage] = useState(post?.cover_image || '')
  const [published, setPublished] = useState(post?.published || false)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: post?.content || '<p>Bat dau viet bai...</p>',
    editorProps: {
      attributes: { class: 'prose max-w-none min-h-[400px] focus:outline-none px-2 py-2' },
    },
  })

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const t = e.target.value
    setTitle(t)
    if (!isEdit) setSlug(slugify(t))
  }

  async function handleCoverImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const res = await fetch('/api/r2/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: 'blog/' + file.name, contentType: file.type }),
    })
    const { url, publicUrl } = await res.json()
    const xhr = new XMLHttpRequest()
    await new Promise<void>((resolve, reject) => {
      xhr.onload = () => resolve()
      xhr.onerror = () => reject()
      xhr.open('PUT', url)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    })
    setCoverImage(publicUrl)
  }

  function addImage() {
    const url = prompt('URL anh:')
    if (url) editor?.chain().focus().setImage({ src: url }).run()
  }

  function addLink() {
    const url = prompt('URL lien ket:')
    if (url) editor?.chain().focus().setLink({ href: url }).run()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const body = { title, slug, content: editor?.getHTML() || '', cover_image: coverImage, published }
    const url = isEdit && post ? '/api/blog/' + post.id : '/api/blog'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) router.push('/admin/blog')
    else alert('Loi luu bai viet')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div>
        <input type="text" value={title} onChange={handleTitleChange} placeholder="Tieu de bai viet..." required
          className="w-full text-4xl font-bold bg-transparent border-0 border-b-2 border-neutral-200 focus:outline-none focus:border-black py-3 placeholder-neutral-300"
          style={{fontFamily:'Georgia,serif'}} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Slug (URL)</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm" />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={"w-12 h-6 rounded-full transition-colors relative " + (published ? 'bg-black' : 'bg-neutral-200')}
              onClick={() => setPublished(!published)}>
              <div className={"absolute top-1 w-4 h-4 bg-white rounded-full transition-transform " + (published ? 'translate-x-7' : 'translate-x-1')} />
            </div>
            <span className="text-sm font-medium">{published ? 'Da dang' : 'Nhap'}</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-neutral-200">
        <h3 className="font-semibold mb-3">Anh bia</h3>
        {coverImage && <div className="mb-3"><img src={coverImage} alt="Cover" className="w-full max-h-48 object-cover rounded-xl" /></div>}
        <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-500 hover:text-black">
          <span>&#128444;</span>
          <span>Chon anh bia</span>
          <input type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" />
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 p-3 border-b border-neutral-200">
          <ToolbarButton onClick={() => { editor?.chain().focus().undo().run() }} title="Hoan tac">&#8617;</ToolbarButton>
          <ToolbarButton onClick={() => { editor?.chain().focus().redo().run() }} title="Lam lai">&#8618;</ToolbarButton>
          <div className="w-px h-5 bg-neutral-200 mx-1" />
          <ToolbarButton onClick={() => { editor?.chain().focus().toggleHeading({ level: 1 }).run() }} active={editor?.isActive('heading', { level: 1 })} title="H1">H1</ToolbarButton>
          <ToolbarButton onClick={() => { editor?.chain().focus().toggleHeading({ level: 2 }).run() }} active={editor?.isActive('heading', { level: 2 })} title="H2">H2</ToolbarButton>
          <ToolbarButton onClick={() => { editor?.chain().focus().toggleHeading({ level: 3 }).run() }} active={editor?.isActive('heading', { level: 3 })} title="H3">H3</ToolbarButton>
          <div className="w-px h-5 bg-neutral-200 mx-1" />
          <ToolbarButton onClick={() => { editor?.chain().focus().toggleBold().run() }} active={editor?.isActive('bold')} title="In dam"><strong>B</strong></ToolbarButton>
          <ToolbarButton onClick={() => { editor?.chain().focus().toggleItalic().run() }} active={editor?.isActive('italic')} title="In nghieng"><em>I</em></ToolbarButton>
          <ToolbarButton onClick={() => { editor?.chain().focus().toggleUnderline().run() }} active={editor?.isActive('underline')} title="Gach chan"><u>U</u></ToolbarButton>
          <ToolbarButton onClick={() => { editor?.chain().focus().toggleStrike().run() }} active={editor?.isActive('strike')} title="Gach ngang"><s>S</s></ToolbarButton>
          <div className="w-px h-5 bg-neutral-200 mx-1" />
          <ToolbarButton onClick={() => { editor?.chain().focus().setTextAlign('left').run() }} active={editor?.isActive({ textAlign: 'left' })} title="Can trai">&#8676;</ToolbarButton>
          <ToolbarButton onClick={() => { editor?.chain().focus().setTextAlign('center').run() }} active={editor?.isActive({ textAlign: 'center' })} title="Can giua">&#8677;</ToolbarButton>
          <ToolbarButton onClick={() => { editor?.chain().focus().setTextAlign('right').run() }} active={editor?.isActive({ textAlign: 'right' })} title="Can phai">&#8678;</ToolbarButton>
          <div className="w-px h-5 bg-neutral-200 mx-1" />
          <ToolbarButton onClick={() => { editor?.chain().focus().toggleBulletList().run() }} active={editor?.isActive('bulletList')} title="Danh sach">&#8226;&#8226;</ToolbarButton>
          <ToolbarButton onClick={() => { editor?.chain().focus().toggleOrderedList().run() }} active={editor?.isActive('orderedList')} title="Danh sach so">1.</ToolbarButton>
          <ToolbarButton onClick={() => { editor?.chain().focus().toggleBlockquote().run() }} active={editor?.isActive('blockquote')} title="Trich dan">&#10075;</ToolbarButton>
          <ToolbarButton onClick={() => { editor?.chain().focus().toggleCodeBlock().run() }} active={editor?.isActive('codeBlock')} title="Code">&lt;/&gt;</ToolbarButton>
          <div className="w-px h-5 bg-neutral-200 mx-1" />
          <ToolbarButton onClick={addLink} title="Chen lien ket">&#128279;</ToolbarButton>
          <ToolbarButton onClick={addImage} title="Chen anh">&#128444;</ToolbarButton>
          <div className="flex-1" />
          <ToolbarButton onClick={() => setPreview(!preview)} title="Preview">{preview ? '&#9997;' : '&#128065;'}</ToolbarButton>
        </div>

        {preview ? (
          <div className="p-6">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }} />
          </div>
        ) : (
          <div className="p-4">
            <EditorContent editor={editor} />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading}
          className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 disabled:opacity-60 transition-opacity cursor-pointer">
          {loading ? 'Dang luu...' : isEdit ? 'Cap nhat' : 'Dang bai'}
        </button>
        <button type="button" onClick={() => router.push('/admin/blog')}
          className="px-8 py-3 border border-neutral-200 rounded-xl font-medium hover:bg-neutral-50 transition-colors cursor-pointer">
          Huy
        </button>
      </div>
    </form>
  )
}
