import { notFound } from 'next/navigation'
import { fetchSoftwareBySlug } from '@/lib/supabase'
import { formatBytes, formatDate, cleanSlug } from '@/lib/utils'
import DownloadButton from './DownloadButton'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const sw = await fetchSoftwareBySlug(cleanSlug(slug))
  if (!sw) return { title: 'Không tìm thấy phần mềm' }
  return {
    title: `${sw.name} - Hữu Tài Genz`,
    description: sw.description,
  }
}

export default async function SoftwareDetailPage({ params }: Props) {
  const { slug } = await params
  const sw = await fetchSoftwareBySlug(cleanSlug(slug))
  if (!sw) notFound()

  return (
    <div className="min-h-screen pt-32 pb-28 px-6 max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        href="/phan-mem"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-black transition-colors mb-10 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
        <span>Quay lại danh sách phần mềm</span>
      </Link>

      {/* Banner */}
      {sw.image_url && (
        <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden mb-12 bg-neutral-100 border border-neutral-200 shadow-sm">
          <img src={sw.image_url} alt={sw.name} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Info & Download Bar */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-12 border-b border-neutral-200 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-neutral-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Phiên bản {sw.version}
            </span>
            <span className="text-xs text-neutral-400 font-medium">
              Cập nhật: {formatDate(sw.updated_at || sw.created_at)}
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-950 tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            {sw.name}
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-3xl">
            {sw.description}
          </p>
        </div>

        {/* Download Box */}
        <div className="min-w-[240px] p-6 bg-neutral-50 rounded-3xl border border-neutral-200 flex flex-col gap-3 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Tải bản cài đặt</p>
          {sw.file_url ? (
            <DownloadButton softwareId={sw.id} fileUrl={sw.file_url} fileName={sw.file_name} />
          ) : (
            <div className="p-3 text-xs text-neutral-400 bg-white rounded-xl border border-neutral-200">
              Liên hệ trực tiếp để nhận bộ cài
            </div>
          )}
          {sw.file_size > 0 && (
            <p className="text-xs text-neutral-500 font-medium">Dung lượng: {formatBytes(sw.file_size)}</p>
          )}
          <p className="text-xs text-neutral-400">📥 {sw.download_count.toLocaleString()} lượt tải thành công</p>
          <a
            href="tel:0902155906"
            className="mt-2 text-xs text-amber-700 hover:underline font-semibold"
          >
            Cần hỗ trợ? Gọi: 0902.155.906
          </a>
        </div>
      </div>

      {/* Features Grid */}
      {sw.features && sw.features.length > 0 && (
        <div className="mb-16">
          <h2
            className="text-2xl sm:text-3xl font-bold text-neutral-950 mb-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Tính Năng Nổi Bật
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sw.features.map((feat: string, idx: number) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3.5"
              >
                <span className="text-amber-500 text-lg font-bold">✦</span>
                <span className="text-sm text-neutral-800 font-medium leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Description (HTML) */}
      {sw.content && (
        <div className="mb-16">
          <h2
            className="text-2xl sm:text-3xl font-bold text-neutral-950 mb-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Giới Thiệu &amp; Hướng Dẫn Chi Tiết
          </h2>
          <div className="prose max-w-none text-neutral-700" dangerouslySetInnerHTML={{ __html: sw.content }} />
        </div>
      )}
    </div>
  )
}