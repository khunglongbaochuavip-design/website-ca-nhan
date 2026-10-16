import Link from 'next/link'
import { fetchSoftwareList, fetchBlogList } from '@/lib/supabase'
import { formatDate, formatBytes, cleanSlug } from '@/lib/utils'
import GameHub from '@/components/game-hub/GameHub'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const [softwareList, blogList] = await Promise.all([
    fetchSoftwareList(),
    fetchBlogList(),
  ])

  const topSoftware = softwareList.slice(0, 4)
  const topBlogs = blogList.slice(0, 3)

  return (
    <div className="overflow-hidden">
      {/* Hero Section - 2 Columns on Desktop */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 pt-24 pb-16">
        {/* Subtle Ambient Background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-amber-200/30 via-transparent to-sky-200/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Brand & Professional Profile */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 text-white text-[11px] font-semibold tracking-wider uppercase mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Chuyên Gia Khảo Thí &amp; Đo Lường Giáo Dục</span>
              </div>

              {/* Main Name */}
              <h1
                className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-950 mb-4"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Hữu Tài Genz
              </h1>

              {/* Core Expertise Statement */}
              <p className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed mb-8 font-normal">
                Khảo thí • Đo lường • Đánh giá • Kì thi chuyên biệt • Kiểm tra đầu vào, đầu ra học phần &amp; Chương trình đào tạo (CTĐT)
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-10">
                <Link
                  href="/phan-mem"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white px-7 py-3.5 rounded-2xl font-medium text-sm hover:bg-neutral-800 transition-all hover:scale-105 shadow-xl shadow-black/10"
                >
                  <span>💻</span>
                  <span>Khám Phá Phần Mềm</span>
                </Link>
                <a
                  href="tel:0902155906"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-100 border border-neutral-200 text-neutral-900 px-7 py-3.5 rounded-2xl font-medium text-sm hover:bg-white hover:border-black transition-all hover:scale-105 shadow-sm"
                >
                  <span>📞</span>
                  <span>Tư Vấn: 0902.155.906</span>
                </a>
              </div>

              {/* Metrics Banner (Apple Style) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full p-5 bg-white/70 backdrop-blur-xl rounded-3xl border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="text-center sm:border-r border-neutral-100 sm:pr-2">
                  <p className="text-2xl sm:text-3xl font-bold font-serif text-neutral-900">10+</p>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Năm Kinh Nghiệm</p>
                </div>
                <div className="text-center sm:border-r border-neutral-100 sm:pr-2">
                  <p className="text-2xl sm:text-3xl font-bold font-serif text-neutral-900">100K+</p>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Bài Thi Đo Lường</p>
                </div>
                <div className="text-center sm:border-r border-neutral-100 sm:pr-2">
                  <p className="text-2xl sm:text-3xl font-bold font-serif text-neutral-900">4+</p>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Phần Mềm</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold font-serif text-neutral-900">100%</p>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Chuẩn MOET</p>
                </div>
              </div>
            </div>

            {/* Right Column: Game Khảo Thí Interactive Arcade Hub */}
            <div className="lg:col-span-7 w-full flex flex-col items-center">
              <GameHub />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Software Section - 4 Big Cards Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Hệ Thống Giải Pháp
            </span>
            <h2
              className="text-4xl sm:text-5xl font-bold mt-4 text-neutral-950 tracking-tight"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Phần Mềm Khảo Thí
            </h2>
          </div>
          <Link
            href="/phan-mem"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition-colors group"
          >
            <span>Xem tất cả 4 phần mềm</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        {/* 4 Cards Grid - 2 cols on tablet & desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topSoftware.map((sw) => (
            <div
              key={sw.id}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-neutral-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1.5"
            >
              {/* Image banner */}
              <div className="aspect-[16/9] w-full bg-neutral-100 relative overflow-hidden">
                {sw.image_url ? (
                  <img
                    src={sw.image_url}
                    alt={sw.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl bg-neutral-100">
                    💻
                  </div>
                )}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="bg-black/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                    v{sw.version}
                  </span>
                </div>
              </div>

              {/* Card content */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-2xl text-neutral-950 mb-3 group-hover:text-amber-700 transition-colors">
                    {sw.name}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {sw.description}
                  </p>

                  {/* Feature Highlights */}
                  {sw.features && sw.features.length > 0 && (
                    <div className="mb-6 space-y-2 bg-neutral-50/70 p-4 rounded-2xl border border-neutral-100">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                        Tính năng cốt lõi
                      </p>
                      {sw.features.slice(0, 2).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                          <span className="text-amber-500 mt-0.5">✦</span>
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card footer */}
                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                  <div className="text-xs text-neutral-500 flex items-center gap-3">
                    <span>📥 {sw.download_count.toLocaleString()} lượt tải</span>
                    {sw.file_size > 0 && <span>• {formatBytes(sw.file_size)}</span>}
                  </div>
                  <Link
                    href={`/phan-mem/${cleanSlug(sw.slug)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-black group-hover:text-amber-700 transition-colors bg-neutral-100 hover:bg-black hover:text-white px-4 py-2 rounded-xl"
                  >
                    <span>Chi Tiết &amp; Tải</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Blog Section */}
      <section className="py-24 px-6 bg-neutral-50/80 border-t border-neutral-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 bg-white px-3 py-1 rounded-full border border-neutral-200">
                Góc Nhìn &amp; Nghiên Cứu
              </span>
              <h2
                className="text-4xl sm:text-5xl font-bold mt-4 text-neutral-950 tracking-tight"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Bài Viết Chuyên Môn
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition-colors group"
            >
              <span>Xem tất cả bài viết</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topBlogs.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${cleanSlug(post.slug)}`}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-neutral-200/70 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[16/10] bg-neutral-100 overflow-hidden">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📖</div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-neutral-400 font-medium block mb-2">
                      {formatDate(post.created_at)}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-neutral-950 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2 mb-3">
                      {post.title}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 group-hover:text-amber-700 inline-flex items-center gap-1 mt-4">
                    Đọc tiếp &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation & Contact CTA */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="bg-neutral-950 text-white rounded-3xl p-10 sm:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/20 to-transparent blur-3xl pointer-events-none rounded-full" />
          <h2
            className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Hợp Tác &amp; Tư Vấn Khảo Thí
          </h2>
          <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Hỗ trợ tư vấn xây dựng ma trận đề thi, phần mềm trích rút ngân hàng câu hỏi, tổ chức kì thi chuyên biệt và chuẩn hóa đánh giá chuẩn đầu ra học phần &amp; CTĐT.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:0902155906"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-bold text-sm hover:bg-neutral-100 transition-all hover:scale-105 shadow-md"
            >
              <span>📞 Hotline: 0902.155.906</span>
            </a>
            <a
              href="https://zalo.me/0902155906"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all hover:scale-105 shadow-md"
            >
              <span>💬 Nhắn Tin Zalo</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}