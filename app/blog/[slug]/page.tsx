import { notFound } from 'next/navigation'
import { fetchBlogBySlug } from '@/lib/supabase'
import { formatDate, cleanSlug } from '@/lib/utils'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await fetchBlogBySlug(cleanSlug(slug))
  if (!post) return { title: 'Không tìm thấy bài viết' }
  return {
    title: `${post.title} - Hữu Tài Genz`,
    description: post.title,
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await fetchBlogBySlug(cleanSlug(slug))
  if (!post) notFound()

  return (
    <div className="min-h-screen pt-32 pb-28 px-6 max-w-3xl mx-auto">
      {/* Back button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-black transition-colors mb-10 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
        <span>Quay lại tất cả bài viết</span>
      </Link>

      {/* Meta Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-semibold text-neutral-500">
          📅 Xuất bản: {formatDate(post.created_at)}
        </span>
        <span className="text-xs text-neutral-300">•</span>
        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
          Tác giả: Hữu Tài Genz
        </span>
      </div>

      {/* Title - Heading 1 */}
      <h1
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-950 leading-tight mb-8"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        {post.title}
      </h1>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-12 bg-neutral-100 border border-neutral-200 shadow-sm">
          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <article
        className="prose max-w-none text-neutral-800 text-base leading-relaxed mb-16"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />

      {/* Author Card at the bottom */}
      <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200/90 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center font-serif font-bold text-2xl flex-shrink-0">
          HT
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-lg text-neutral-950">Hữu Tài Genz</h3>
          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
            Chuyên gia về Khảo thí • Đo lường • Đánh giá • Kì thi chuyên biệt • Kiểm tra đầu vào, đầu ra học phần &amp; CTĐT.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <a
              href="tel:0902155906"
              className="text-xs font-bold text-black hover:underline"
            >
              📞 Hotline: 0902.155.906
            </a>
            <span className="text-neutral-300">•</span>
            <a
              href="https://zalo.me/0902155906"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              💬 Zalo tư vấn
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}