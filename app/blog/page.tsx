import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

async function getAllBlogs() {
  const { data } = await supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false })
  return data || []
}

export const revalidate = 60

export default async function BlogPage() {
  const posts = await getAllBlogs()

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-sm tracking-widest uppercase text-neutral-400 mb-4">Suy nghi</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{fontFamily:'Georgia,serif'}}>Blog</h1>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Chia se kien thuc, kinh nghiem va goc nhin ve cong nghe.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-32 text-neutral-400">
            <p className="text-6xl mb-4">&#128214;</p>
            <p>Chua co bai viet nao.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link key={post.id} href={"/"+"blog/"+post.slug}
                className="group flex flex-col md:flex-row gap-8 p-8 md:p-10 bg-neutral-50 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="w-full md:w-80 md:flex-shrink-0 aspect-[4/3] md:aspect-auto md:h-56 bg-neutral-200 rounded-2xl overflow-hidden">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">&#128214;</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-sm text-neutral-400 mb-3">{formatDate(post.created_at)}</p>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:underline leading-snug" style={{fontFamily:'Georgia,serif'}}>
                    {post.title}
                  </h2>
                  <div
                    className="text-neutral-500 text-sm line-clamp-3 leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{__html: (post.content || '').replace(/<[^>]+>/g, ' ').slice(0, 200) + '...'}}
                  />
                  <span className="text-sm font-medium text-black">Doc tiep &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
