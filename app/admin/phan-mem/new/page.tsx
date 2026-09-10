import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '../../AdminSidebar'
import SoftwareForm from '../SoftwareForm'

export default async function NewSoftwarePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  if (!token || token.value !== process.env.ADMIN_TOKEN) redirect('/admin/login')

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8" style={{fontFamily:'Georgia,serif'}}>Them Phan Mem Moi</h1>
        <SoftwareForm />
      </main>
    </div>
  )
}
