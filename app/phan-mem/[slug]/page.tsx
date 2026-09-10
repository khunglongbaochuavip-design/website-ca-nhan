import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { formatBytes, formatDate } from '@/lib/utils'
import DownloadButton from './DownloadButton'

interface Props {
  params: Promise<{ slug: string }>
}

async function getSoftware(slug: string) {
  const { data } = await supabase.from('software').select('*').eq('slug', slug).single()
  return data
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const sw = await getSoftware(slug)
  if (!sw) return { title: 'Khong tim thay' }
  return { title: sw.name + ' - Tai Dev', description: sw.description }
}

export const revalidate = 60

export default async function SoftwareDetailPage({ params }: Props) {
  const { slug } = await params
  const sw = await getSoftware(slug)
  if (!sw) notFound()

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-16">
          {sw.image_url && (
            <div className="aspect-video rounded-3xl overflow-hidden mb-12 bg-neutral-100">
              <img src={sw.image_url} alt={sw.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-black text-white text-sm px-4 py-1.5 rounded-full font-medium">v{sw.version}</span>
                <span className="text-sm text-neutral-400">{formatDate(sw.created_at)}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{fontFamily:'Georgia,serif'}}>{sw.name}</h1>
              <p className="text-xl text-neutral-500 leading-relaxed">{sw.description}</p>
            </div>
            <div className="flex flex-col gap-3 min-w-[220px]">
              {sw.file_url ? (
                <DownloadButton softwareId={sw.id} fileUrl={sw.file_url} fileName={sw.file_name} />
              ) : (
                <div className="text-sm text-neutral-400 text-center py-4 border border-neutral-200 rounded-2xl">Chua co file tai ve</div>
              )}
              {sw.file_size > 0 && <p className="text-xs text-neutral-400 text-center">Kich thuoc: {formatBytes(sw.file_size)}</p>}
              <p className="text-xs text-neutral-400 text-center">{(sw.download_count || 0).toLocaleString()} luot tai</p>
            </div>
          </div>
        </div>
        {sw.features && sw.features.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8" style={{fontFamily:'Georgia,serif'}}>Tinh Nang Noi Bat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sw.features.map((f: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-5 bg-neutral-50 rounded-2xl">
                  <span>&#9830;</span>
                  <span className="text-neutral-700">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {sw.content && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8" style={{fontFamily:'Georgia,serif'}}>Gioi Thieu</h2>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sw.content }} />
          </div>
        )}
      </div>
    </div>
  )
}
