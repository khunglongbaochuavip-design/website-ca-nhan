import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '../../AdminSidebar'
import BlogEditor from '../BlogEditor'

export default async function NewBlogPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  const expectedToken = process.env.ADMIN_TOKEN || 'secret-admin-token-2026'
  if (!token || token.value !== expectedToken) redirect('/admin/login')


  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8" style={{fontFamily:'Georgia,serif'}}>Bai Viet Moi</h1>
        <BlogEditor />
      </main>
    </div>
  )
}
