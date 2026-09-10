'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          Tai Dev
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/phan-mem" className="text-sm text-neutral-600 hover:text-black transition-colors">Phan Mem</Link>
          <Link href="/blog" className="text-sm text-neutral-600 hover:text-black transition-colors">Blog</Link>
        </div>
        <button
          className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="w-5 h-0.5 bg-black mb-1.5" />
          <div className="w-5 h-0.5 bg-black mb-1.5" />
          <div className="w-5 h-0.5 bg-black" />
        </button>
      </nav>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 px-6 py-4 flex flex-col gap-4">
          <Link href="/phan-mem" className="text-sm py-2" onClick={() => setMenuOpen(false)}>Phan Mem</Link>
          <Link href="/blog" className="text-sm py-2" onClick={() => setMenuOpen(false)}>Blog</Link>
        </div>
      )}
    </header>
  )
}
