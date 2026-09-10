'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-neutral-100'
          : 'bg-white/50 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-serif font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            HT
          </div>
          <div>
            <span className="font-serif font-bold text-xl tracking-tight block text-neutral-900 group-hover:text-black transition-colors">
              Hữu Tài Genz
            </span>
            <span className="text-[10px] tracking-wider uppercase text-neutral-500 font-medium block">
              Khảo Thí & Đo Lường Giáo Dục
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-100/70 p-1.5 rounded-full border border-neutral-200/60 backdrop-blur-md">
          <Link
            href="/"
            className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
              pathname === '/'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-600 hover:text-black hover:bg-white/50'
            }`}
          >
            Trang Chủ
          </Link>
          <Link
            href="/phan-mem"
            className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
              pathname.startsWith('/phan-mem')
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-600 hover:text-black hover:bg-white/50'
            }`}
          >
            Phần Mềm
          </Link>
          <Link
            href="/blog"
            className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
              pathname.startsWith('/blog')
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-600 hover:text-black hover:bg-white/50'
            }`}
          >
            Blog Chuyên Môn
          </Link>
        </div>

        {/* Contact Hotline Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:0902155906"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-black hover:scale-105 transition-all shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>0902.155.906</span>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          className="md:hidden p-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className={`w-5 h-0.5 bg-black transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1.5'}`} />
          <div className={`w-5 h-0.5 bg-black transition-all ${menuOpen ? 'opacity-0' : 'mb-1.5'}`} />
          <div className={`w-5 h-0.5 bg-black transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-neutral-200 px-6 py-6 flex flex-col gap-4 shadow-xl">
          <Link href="/" className="text-sm font-medium py-2 text-neutral-800" onClick={() => setMenuOpen(false)}>
            Trang Chủ
          </Link>
          <Link href="/phan-mem" className="text-sm font-medium py-2 text-neutral-800" onClick={() => setMenuOpen(false)}>
            Phần Mềm Khảo Thí
          </Link>
          <Link href="/blog" className="text-sm font-medium py-2 text-neutral-800" onClick={() => setMenuOpen(false)}>
            Blog Nghiên Cứu
          </Link>
          <a
            href="tel:0902155906"
            className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded-2xl text-xs font-medium mt-2"
          >
            <span>📞 Gọi ngay: 0902 155 906</span>
          </a>
        </div>
      )}
    </header>
  )
}