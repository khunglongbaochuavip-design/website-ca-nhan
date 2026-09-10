import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} Tai Dev. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/phan-mem" className="text-sm text-neutral-500 hover:text-black transition-colors">Phan Mem</Link>
          <Link href="/blog" className="text-sm text-neutral-500 hover:text-black transition-colors">Blog</Link>
          <Link href="/admin/login" className="text-xs text-neutral-300 hover:text-neutral-500 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
