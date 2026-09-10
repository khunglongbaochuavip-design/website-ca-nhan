import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AdminSidebar from '../AdminSidebar'
import { formatBytes, formatDate } from '@/lib/utils'
import DeleteSoftwareButton from './DeleteSoftwareButton'

export default async function AdminSoftwarePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  if (!token || token.value !== process.env.ADMIN_TOKEN) redirect('/admin/login')

  const { data: software } = await supabase.from('software').select('*').order('created_at', { ascending: false })

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{fontFamily:'Georgia,serif'}}>Phan Mem</h1>
          <Link href="/admin/phan-mem/new" className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90">
            + Them moi
          </Link>
        </div>
        <div className="space-y-4">
          {(!software || software.length === 0) && (
            <div className="text-center py-16 text-neutral-400">Chua co phan mem nao.</div>
          )}
          {software?.map((sw) => (
            <div key={sw.id} className="bg-white rounded-2xl p-5 border border-neutral-200 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                {sw.image_url ? (
                  <img src={sw.image_url} alt={sw.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">&#128187;</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{sw.name}</h3>
                <p className="text-sm text-neutral-400">v{sw.version} &middot; {sw.file_size > 0 ? formatBytes(sw.file_size) : 'Chua co file'} &middot; {sw.download_count || 0} luot tai</p>
                <p className="text-xs text-neutral-400 mt-0.5">{formatDate(sw.created_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={"/"+"admin/phan-mem/"+sw.id}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-sm hover:bg-neutral-50 transition-colors">
                  Sua
                </Link>
                <DeleteSoftwareButton id={sw.id} name={sw.name} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
