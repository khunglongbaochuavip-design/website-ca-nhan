import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { fetchBlogList } from '@/lib/supabase'
import Link from 'next/link'
import AdminSidebar from '../AdminSidebar'
import { formatDate } from '@/lib/utils'
import DeleteBlogButton from './DeleteBlogButton'

export default async function AdminBlogPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  if (!token || token.value !== process.env.ADMIN_TOKEN) redirect('/admin/login')

  const posts = await fetchBlogList()

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar />
      <main className="flex-1 p-8 sm:p-12">
        <div className="max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Danh Mục Quản Lý</span>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif mt-1 text-neutral-900">Bài Viết Blog</h1>
            </div>
            <Link href="/admin/blog/new" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl text-xs font-bold hover:bg-neutral-800 transition-all self-start shadow-sm">
              <span>+ Viết Bài Mới</span>
            </Link>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-100">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">📖</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg text-neutral-900 truncate">{post.title}</h3>
                    <span className={"text-[11px] font-semibold px-2.5 py-0.5 rounded-full " + (post.published ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500')}>
                      {post.published ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-2">
                    Ngày đăng: {formatDate(post.created_at)} &middot; Tác giả: Hữu Tài Genz
                  </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link href={"/admin/blog/" + post.id} className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-semibold hover:bg-neutral-50 transition-colors">
                    Sửa
                  </Link>
                  <DeleteBlogButton id={post.id} title={post.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
