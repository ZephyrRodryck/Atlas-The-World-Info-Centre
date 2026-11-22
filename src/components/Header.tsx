'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SearchOverlay from './Search/SearchOverlay'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(o => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-silver/10">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-copper/10 border border-copper/30 flex items-center justify-center group-hover:bg-copper/20 transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="#E8743B" strokeWidth="1.5"/>
                <ellipse cx="8" cy="8" rx="3" ry="6" stroke="#E8743B" strokeWidth="1" opacity="0.6"/>
                <line x1="2" y1="8" x2="14" y2="8" stroke="#E8743B" strokeWidth="1" opacity="0.4"/>
              </svg>
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-wider text-silver-bright">ATLAS</span>
              <span className="hidden sm:inline ml-2 font-mono text-[10px] text-silver/40 tracking-widest uppercase">Intelligence</span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-silver/70 hover:text-copper transition-colors">
              Globe
            </Link>
            <Link href="/directory" className="text-sm text-silver/70 hover:text-copper transition-colors">
              Directory
            </Link>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-navy-50/50 border border-silver/15 rounded-lg text-sm text-silver/50 hover:border-copper/30 hover:text-silver/70 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Search</span>
              <kbd className="hidden lg:inline ml-2 px-1.5 py-0.5 bg-navy/50 rounded text-[10px] font-mono text-silver/30 border border-silver/10">⌘K</kbd>
            </button>
          </nav>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-silver/60 hover:text-copper transition-colors"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <Link
              href="/directory"
              className="w-10 h-10 flex items-center justify-center text-silver/60 hover:text-copper transition-colors"
              aria-label="Directory"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="2" rx="0.5" fill="currentColor" opacity="0.6"/>
                <rect x="2" y="7" width="12" height="2" rx="0.5" fill="currentColor" opacity="0.4"/>
                <rect x="2" y="11" width="12" height="2" rx="0.5" fill="currentColor" opacity="0.3"/>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}
