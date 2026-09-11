import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase, fetchSoftwareList, fetchBlogList } from '@/lib/supabase'
import AdminSidebar from './AdminSidebar'

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  const expectedToken = process.env.ADMIN_TOKEN || 'secret-admin-token-2026'
  if (!token || token.value !== expectedToken) redirect('/admin/login')


  const [software, blogs] = await Promise.all([
    fetchSoftwareList(),
    fetchBlogList(),
  ])

  const swCount = software.length
  const blogCount = blogs.length
  const totalDownloads = software.reduce((sum, s) => sum + (s.download_count || 0), 0)

  const stats = [
    { label: 'Phần Mềm Khảo Thí', value: swCount, icon: '💻' },
    { label: 'Bài Viết Chuyên Môn', value: blogCount, icon: '📖' },
    { label: 'Tổng Lượt Tải', value: totalDownloads.toLocaleString(), icon: '📥' },
  ]

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar />
      <main className="flex-1 p-8 sm:p-12">
        <div className="max-w-6xl">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Bảng Quản Trị</span>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif mt-1 text-neutral-900">Tổng Quan Hệ Thống</h1>
            <p className="text-sm text-neutral-500 mt-1">Xin chào <strong>Hữu Tài Genz</strong>, quản lý phần mềm và bài viết tại đây.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map(({ label, value, icon }) => (
              <div key={label} className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{label}</span>
                  <span className="text-2xl">{icon}</span>
                </div>
                <p className="text-3xl sm:text-4xl font-bold font-serif text-neutral-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
            <h2 className="font-serif font-bold text-xl mb-3 text-neutral-900">Thao Tác Nhanh</h2>
            <p className="text-sm text-neutral-500 mb-6">Thêm phần mềm mới tải lên kho lưu trữ đám mây hoặc viết bài chia sẻ chuyên môn.</p>
            <div className="flex flex-wrap gap-4">
              <a href="/admin/phan-mem/new" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-sm">
                <span>+ Thêm Phần Mềm Khảo Thí</span>
              </a>
              <a href="/admin/blog/new" className="inline-flex items-center gap-2 bg-neutral-100 border border-neutral-200 text-neutral-900 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-white hover:border-black transition-all shadow-sm">
                <span>+ Soạn Bài Viết Mới</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
