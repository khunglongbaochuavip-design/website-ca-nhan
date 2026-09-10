import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Software, BlogPost } from '@/lib/supabase'
import { formatDate, formatBytes } from '@/lib/utils'

async function getLatestSoftware(): Promise<Software[]> {
  const { data } = await supabase
    .from('software')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4)
  return data || []
}

async function getLatestBlogs(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3)
  return data || []
}

export default async function HomePage() {
  const [software, blogs] = await Promise.all([getLatestSoftware(), getLatestBlogs()])

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 to-white" />
        <div className="relative z-10 max-w-4xl">
          <p className="text-sm tracking-widest uppercase text-neutral-400 mb-6">Xin chao</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight" style={{fontFamily: 'Georgia, serif'}}>
            Tai Dev
          </h1>
          <p className="text-xl md:text-2xl text-neutral-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Chia se phan mem huu ich va nhung bai viet cong nghe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/phan-mem"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Kham pha Phan Mem
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 border border-black text-black px-8 py-4 rounded-2xl font-medium text-sm hover:bg-black hover:text-white transition-all"
            >
              Doc Blog
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-400">
          <span className="text-xs tracking-widest uppercase">Cuon xuong</span>
          <div className="w-px h-8 bg-neutral-300 animate-pulse" />
        </div>
      </section>

      {/* Software Section */}
      {software.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-sm tracking-widest uppercase text-neutral-400 mb-3">Cong cu</p>
                <h2 className="text-4xl md:text-5xl font-bold" style={{fontFamily: 'Georgia, serif'}}>Phan Mem</h2>
              </div>
              <Link href="/phan-mem" className="hidden md:inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors">
                Xem tat ca &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {software.map((sw) => (
                <Link key={sw.id} href={`/phan-mem/${sw.slug}`}
                  className="group block bg-neutral-50 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="aspect-video bg-neutral-200 relative overflow-hidden">
                    {sw.image_url ? (
                      <img src={sw.image_url} alt={sw.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">&#128187;</div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-xl">{sw.name}</h3>
                      <span className="text-xs bg-black text-white px-3 py-1 rounded-full font-medium">v{sw.version}</span>
                    </div>
                    <p className="text-neutral-500 text-sm leading-relaxed mb-6 line-clamp-2">{sw.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400">
                        &#11015; {sw.download_count?.toLocaleString() || 0} luot tai
                      </span>
                      {sw.file_size > 0 && (
                        <span className="text-xs text-neutral-400">{formatBytes(sw.file_size)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      {blogs.length > 0 && (
        <section className="py-24 px-6 bg-neutral-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-sm tracking-widest uppercase text-neutral-400 mb-3">Bai viet</p>
                <h2 className="text-4xl md:text-5xl font-bold" style={{fontFamily: 'Georgia, serif'}}>Blog</h2>
              </div>
              <Link href="/blog" className="hidden md:inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors">
                Xem tat ca &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <div className="aspect-[4/3] bg-neutral-200 rounded-2xl overflow-hidden mb-4">
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">&#128214;</div>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mb-2">{formatDate(post.created_at)}</p>
                  <h3 className="font-bold text-lg group-hover:underline leading-snug">{post.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
