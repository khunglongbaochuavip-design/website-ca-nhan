import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { fetchSoftwareById } from '@/lib/supabase'
import AdminSidebar from '../../AdminSidebar'
import SoftwareForm from '../SoftwareForm'

export default async function EditSoftwarePage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  const expectedToken = process.env.ADMIN_TOKEN || 'secret-admin-token-2026'
  if (!token || token.value !== expectedToken) redirect('/admin/login')


  const { id } = await params
  const software = await fetchSoftwareById(id)
  if (!software) redirect('/admin/phan-mem')


  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8" style={{fontFamily:'Georgia,serif'}}>Sua Phan Mem</h1>
        <SoftwareForm software={software} isEdit />
      </main>
    </div>
  )
}
