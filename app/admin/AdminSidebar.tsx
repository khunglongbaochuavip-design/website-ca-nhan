'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/admin-logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const links = [
    { href: '/admin', label: 'Dashboard', icon: '&#128200;' },
    { href: '/admin/phan-mem', label: 'Phan Mem', icon: '&#128187;' },
    { href: '/admin/blog', label: 'Blog', icon: '&#128214;' },
  ]

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-neutral-200 flex flex-col">
      <div className="p-6 border-b border-neutral-200">
        <Link href="/" className="font-bold text-lg">Tai Dev</Link>
        <p className="text-xs text-neutral-400 mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon }) => (
          <Link key={href} href={href}
            className={"flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors " +
              (pathname === href ? 'bg-black text-white' : 'text-neutral-600 hover:bg-neutral-100')}>
            <span dangerouslySetInnerHTML={{__html: icon}} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-neutral-200">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors w-full">
          &#128682; Dang xuat
        </button>
      </div>
    </aside>
  )
}
