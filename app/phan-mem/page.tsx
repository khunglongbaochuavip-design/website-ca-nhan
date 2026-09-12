import Link from 'next/link'
import { fetchSoftwareList } from '@/lib/supabase'
import { formatBytes, cleanSlug } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SoftwarePage() {
  const software = await fetchSoftwareList()

  return (
    <div className="min-h-screen pt-32 pb-28 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200/50">
          Phần Mềm Khảo Thí &amp; Đo Lường
        </span>
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold mt-6 mb-6 text-neutral-950 tracking-tight"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Hệ Thống Phần Mềm
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed">
          Các bộ công cụ và phần mềm chuyên dụng phục vụ công tác xây dựng ngân hàng đề thi, đo lường độ tin cậy, chấm thi tự động và đánh giá chuẩn đầu ra CTĐT của Chuyên gia <strong>Hữu Tài Genz</strong>.
        </p>
      </div>

      {/* Grid: 2 columns on desktop = exactly 4 big boxes per screen view */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {software.map((sw) => (
          <div
            key={sw.id}
            className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-neutral-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.09)] transition-all duration-500 hover:-translate-y-2"
          >
            {/* Image Banner */}
            <div className="aspect-[16/9] w-full bg-neutral-100 relative overflow-hidden">
              {sw.image_url ? (
                <img
                  src={sw.image_url}
                  alt={sw.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">💻</div>
              )}
              <div className="absolute top-4 right-4">
                <span className="bg-black/85 backdrop-blur-md text-white text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm">
                  v{sw.version}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-2xl sm:text-3xl text-neutral-950 mb-3 group-hover:text-amber-700 transition-colors">
                  {sw.name}
                </h2>
                <p className="text-neutral-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {sw.description}
                </p>

                {/* Features */}
                {sw.features && sw.features.length > 0 && (
                  <div className="mb-6 space-y-2 bg-neutral-50/80 p-5 rounded-2xl border border-neutral-100">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                      Tính năng nổi bật
                    </p>
                    {sw.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                        <span className="text-amber-500 font-bold mt-0.5">✦</span>
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action and Download Stats */}
              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                <div className="text-xs text-neutral-500 flex items-center gap-3 font-medium">
                  <span>📥 {sw.download_count.toLocaleString()} lượt tải</span>
                  {sw.file_size > 0 && <span>• {formatBytes(sw.file_size)}</span>}
                </div>
                <Link
                  href={`/phan-mem/${cleanSlug(sw.slug)}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-black bg-neutral-100 group-hover:bg-black group-hover:text-white px-5 py-2.5 rounded-xl transition-all"
                >
                  <span>Chi Tiết &amp; Tải Về</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}