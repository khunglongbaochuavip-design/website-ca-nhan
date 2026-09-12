import Link from 'next/link'
import { fetchBlogList } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BlogPage() {
  const blogs = await fetchBlogList()

  return (
    <div className="min-h-screen pt-32 pb-28 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 px-3.5 py-1.5 rounded-full border border-neutral-200">
          Chuyên San &amp; Góc Nhìn
        </span>
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold mt-6 mb-6 text-neutral-950 tracking-tight"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Blog Khảo Thí
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed">
          Tổng hợp các nghiên cứu, bài viết chuyên sâu và cẩm nang kinh nghiệm thực tế về đo lường giáo dục, ma trận đề thi chuẩn hóa và đánh giá chuẩn đầu ra của <strong>Hữu Tài Genz</strong>.
        </p>
      </div>

      {/* Blog Cards List */}
      <div className="space-y-8 max-w-5xl mx-auto">
        {blogs.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col md:flex-row gap-8 p-6 sm:p-8 bg-white rounded-3xl border border-neutral-200/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Cover Image */}
            <div className="w-full md:w-80 md:flex-shrink-0 aspect-[16/10] md:aspect-auto md:h-60 bg-neutral-100 rounded-2xl overflow-hidden">
              {post.cover_image ? (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">📖</div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between py-2">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-neutral-400">
                    📅 {formatDate(post.created_at)}
                  </span>
                  <span className="text-xs text-neutral-300">•</span>
                  <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-0.5 rounded-full">
                    Khảo Thí &amp; Đo Lường
                  </span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-neutral-950 group-hover:text-amber-700 transition-colors leading-snug mb-4"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  {post.title}
                </h2>
                <div
                  className="text-neutral-600 text-sm leading-relaxed line-clamp-3 mb-6"
                  dangerouslySetInnerHTML={{
                    __html: (post.content || '').replace(/<[^>]+>/g, ' ').slice(0, 220) + '...',
                  }}
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-black group-hover:text-amber-700 transition-colors">
                <span>Đọc toàn bộ bài viết</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}