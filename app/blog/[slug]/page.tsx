import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

async function getBlogPost(slug: string) {
  const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('published', true).single()
  return data
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: 'Khong tim thay' }
  return { title: post.title + ' - Tai Dev' }
}

export const revalidate = 60

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-black transition-colors mb-12">
          &larr; Tat ca bai viet
        </Link>

        {post.cover_image && (
          <div className="aspect-video rounded-3xl overflow-hidden mb-12 bg-neutral-100">
            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-neutral-400 mb-6">
          <span>{formatDate(post.created_at)}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-12 leading-tight" style={{fontFamily:'Georgia,serif'}}>
          {post.title}
        </h1>

        <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
      </div>
    </div>
  )
}
