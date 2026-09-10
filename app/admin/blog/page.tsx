import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AdminSidebar from '../AdminSidebar'
import { formatDate } from '@/lib/utils'
import DeleteBlogButton from './DeleteBlogButton'

export default async function AdminBlogPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  if (!token || token.value !== process.env.ADMIN_TOKEN) redirect('/admin/login')

  const { data: posts } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{fontFamily:'Georgia,serif'}}>Blog</h1>
          <Link href="/admin/blog/new" className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90">
            + Bai viet moi
          </Link>
        </div>
        <div className="space-y-3">
          {(!posts || posts.length === 0) && (
            <div className="text-center py-16 text-neutral-400">Chua co bai viet nao.</div>
          )}
          {posts?.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-5 border border-neutral-200 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                {post.cover_image ? (
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">&#128214;</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold truncate">{post.title}</h3>
                  <span className={"text-xs px-2 py-0.5 rounded-full " + (post.published ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500')}>
                    {post.published ? 'Da dang' : 'Nhap'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">{formatDate(post.created_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={"/"+"admin/blog/"+post.id}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-sm hover:bg-neutral-50 transition-colors">
                  Sua
                </Link>
                <DeleteBlogButton id={post.id} title={post.title} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
