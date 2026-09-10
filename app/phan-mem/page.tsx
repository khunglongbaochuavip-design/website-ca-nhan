import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Software } from '@/lib/supabase'
import { formatBytes } from '@/lib/utils'

async function getAllSoftware(): Promise<Software[]> {
  const { data } = await supabase
    .from('software')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export const revalidate = 60

export default async function SoftwarePage() {
  const software = await getAllSoftware()

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-sm tracking-widest uppercase text-neutral-400 mb-4">Cong cu</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{fontFamily: 'Georgia, serif'}}>Phan Mem</h1>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Tuyen tap cac phan mem duoc phat trien va chia se boi Tai Dev.
          </p>
        </div>

        {software.length === 0 ? (
          <div className="text-center py-32 text-neutral-400">
            <p className="text-6xl mb-4">&#128187;</p>
            <p>Chua co phan mem nao.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {software.map((sw) => (
              <Link
                key={sw.id}
                href={`/phan-mem/${sw.slug}`}
                className="group block bg-neutral-50 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-[16/10] bg-neutral-200 relative overflow-hidden">
                  {sw.image_url ? (
                    <img
                      src={sw.image_url}
                      alt={sw.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl">&#128187;</div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
                      v{sw.version}
                    </span>
                  </div>
                </div>

                <div className="p-8 md:p-10">
                  <h2 className="font-bold text-2xl md:text-3xl mb-3 group-hover:underline">{sw.name}</h2>
                  <p className="text-neutral-500 leading-relaxed mb-6 line-clamp-3">{sw.description}</p>

                  {sw.features && sw.features.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Tinh nang noi bat</p>
                      <ul className="space-y-1.5">
                        {sw.features.slice(0, 3).map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                            <span className="text-black mt-0.5">&#9830;</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
                    <div className="flex items-center gap-4 text-xs text-neutral-400">
                      <span>&#11015; {(sw.download_count || 0).toLocaleString()} luot tai</span>
                      {sw.file_size > 0 && <span>{formatBytes(sw.file_size)}</span>}
                    </div>
                    <span className="text-sm font-medium text-black">Xem chi tiet &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
