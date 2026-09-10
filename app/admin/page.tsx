import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AdminSidebar from './AdminSidebar'

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  if (!token || token.value !== process.env.ADMIN_TOKEN) redirect('/admin/login')

  const [{ count: swCount }, { count: blogCount }, { data: downloads }] = await Promise.all([
    supabase.from('software').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('software').select('download_count'),
  ])

  const totalDownloads = downloads?.reduce((sum, s) => sum + (s.download_count || 0), 0) || 0

  const stats = [
    { label: 'Phan Mem', value: swCount || 0, icon: '&#128187;' },
    { label: 'Bai Blog', value: blogCount || 0, icon: '&#128214;' },
    { label: 'Luot Tai', value: totalDownloads.toLocaleString(), icon: '&#11015;' },
  ]

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8" style={{fontFamily:'Georgia,serif'}}>Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map(({ label, value, icon }) => (
            <div key={label} className="bg-white rounded-2xl p-6 border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-neutral-500">{label}</span>
                <span className="text-2xl" dangerouslySetInnerHTML={{__html: icon}} />
              </div>
              <p className="text-4xl font-bold">{value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 border border-neutral-200">
          <h2 className="font-semibold mb-4">Hanh dong nhanh</h2>
          <div className="flex gap-3">
            <a href="/admin/phan-mem/new" className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90">+ Them phan mem</a>
            <a href="/admin/blog/new" className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90">+ Viet bai blog</a>
          </div>
        </div>
      </main>
    </div>
  )
}
