import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { fetchSoftwareList } from '@/lib/supabase'
import Link from 'next/link'
import AdminSidebar from '../AdminSidebar'
import { formatBytes, formatDate } from '@/lib/utils'
import DeleteSoftwareButton from './DeleteSoftwareButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminSoftwarePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  const expectedToken = process.env.ADMIN_TOKEN || 'secret-admin-token-2026'
  if (!token || token.value !== expectedToken) redirect('/admin/login')


  const software = await fetchSoftwareList()

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar />
      <main className="flex-1 p-8 sm:p-12">
        <div className="max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Danh Mục Quản Lý</span>
              <h1 className="text-3xl sm:text-4xl font-bold font-serif mt-1 text-neutral-900">Phần Mềm Khảo Thí</h1>
            </div>
            <Link href="/admin/phan-mem/new" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl text-xs font-bold hover:bg-neutral-800 transition-all self-start shadow-sm">
              <span>+ Thêm Phần Mềm Mới</span>
            </Link>
          </div>

          <div className="space-y-4">
            {software.map((sw) => (
              <div key={sw.id} className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-100">
                  {sw.image_url ? (
                    <img src={sw.image_url} alt={sw.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">💻</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg text-neutral-900 truncate">{sw.name}</h3>
                    <span className="text-[11px] font-semibold bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full">v{sw.version}</span>
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-1">{sw.description}</p>
                  <p className="text-[11px] text-neutral-400 mt-2">
                    {sw.file_size > 0 ? formatBytes(sw.file_size) : 'Chưa gắn file'} &middot; {sw.download_count} lượt tải &middot; Cập nhật: {formatDate(sw.updated_at || sw.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link href={"/admin/phan-mem/" + sw.id} className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-semibold hover:bg-neutral-50 transition-colors">
                    Sửa
                  </Link>
                  <DeleteSoftwareButton id={sw.id} name={sw.name} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
