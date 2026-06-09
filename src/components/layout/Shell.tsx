"use client"

import { useState, useEffect, useRef } from 'react'
import { X, Sun, Moon, Search, Menu, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface ShellProps {
  children: React.ReactNode
}

const NAV_LINKS = [
  { label: 'AI Tools', href: '/ai-tools', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=400&q=60', desc: 'Reviews & guides' },
  { label: 'Devices', href: '/devices', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=60', desc: 'Gadget reviews' },
  { label: 'Career', href: '/career', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=60', desc: 'Growth & upskilling' },
  { label: 'Student Earning', href: '/student', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=60', desc: 'Earn while studying' },
  { label: 'Tech News', href: '/tech-news', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=60', desc: 'India tech digest' },
  { label: 'Tutorials', href: '/tutorials', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=60', desc: 'Step-by-step guides' },
  { label: 'Tools', href: '/tools', image: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&w=400&q=60', desc: 'Interactive tools' },
]

export function Shell({ children }: ShellProps) {
  const getInitialTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light'
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // keep document class and persisted theme in sync with React state
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('theme', theme)
    } catch {}
  }, [theme])

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [menuOpen])

  // Close menu on route change
  const prevPathname = useRef(pathname)
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname
      setMenuOpen(false)
    }
  }, [pathname])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Top App Bar ── */}
      <header className="fixed top-0 w-full h-16 z-50 backdrop-blur-md bg-surface/90 border-b border-outline-variant">
        <div className="flex items-center justify-between max-w-page-max-width mx-auto px-gutter h-full gap-4">

          {/* Left: Logo + Name */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image
              src="/logo.png"
              alt="Expliq"
              width={32}
              height={32}
              className="dark:invert transition-all duration-200 group-hover:opacity-80 translate-y-0.5"
              priority
            />
            <span className="font-(family-name:--font-brand) font-extrabold text-2xl tracking-tight text-on-surface group-hover:text-primary transition-colors">
              Expliq
            </span>
          </Link>

          {/* Right: Search + Menu */}
          <div className="flex items-center gap-1" ref={menuRef}>
            <Link
              href="/search"
              className="p-2.5 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
              title="Search"
            >
              <Search size={18} />
            </Link>

            {/* Menu Button */}
            <button
              onMouseDown={(e) => { e.stopPropagation(); setMenuOpen(v => !v) }}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-200 ${
                menuOpen
                  ? 'bg-primary text-on-primary border-primary'
                  : 'border-outline-variant text-on-surface hover:border-outline hover:bg-surface-container-high'
              }`}
              title="Menu"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
              <span className="text-xs font-semibold hidden sm:block">Menu</span>
            </button>

            {/* ── Mega Menu Panel ── */}
            {menuOpen && (
              <div className="absolute top-[calc(100%+4px)] right-0 w-screen max-w-sm sm:max-w-md md:max-w-lg bg-surface border border-outline-variant rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-150"
                style={{ top: '68px', right: 'max(0px, calc((100vw - var(--page-max-width, 1280px)) / 2))' }}
              >
                {/* Categories header */}
                <div className="px-5 pt-4 pb-2 border-b border-outline-variant/50 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Categories</span>
                  <Link href="/" onClick={() => setMenuOpen(false)} className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-0.5">
                    Home <ChevronRight size={10} />
                  </Link>
                </div>

                {/* Category grid */}
                <nav className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-3">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`group flex items-center gap-0 rounded-xl overflow-hidden border transition-all duration-150 ${
                        isActive(link.href)
                          ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20'
                          : 'border-outline-variant hover:border-outline hover:bg-surface-container-low'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-12 shrink-0 overflow-hidden bg-surface-variant">
                        <img
                          src={link.image}
                          alt={link.label}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      {/* Text */}
                      <div className="px-3 flex-1 min-w-0">
                        <div className={`text-sm font-semibold truncate ${isActive(link.href) ? 'text-primary' : 'text-on-surface'}`}>
                          {link.label}
                        </div>
                        <div className="text-[10px] text-on-surface-variant truncate">{link.desc}</div>
                      </div>
                      {isActive(link.href) && (
                        <span className="w-1 self-stretch bg-primary rounded-r-xl shrink-0" />
                      )}
                    </Link>
                  ))}
                </nav>

                {/* Divider + Theme toggle */}
                <div className="border-t border-outline-variant/50 px-5 py-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-on-surface">Appearance</div>
                    <div className="text-[10px] text-on-surface-variant mt-0.5">
                      {theme === 'dark' ? 'Dark mode is on' : 'Light mode is on'}
                    </div>
                  </div>
                  {/* Toggle pill */}
                  <button
                    onClick={toggleTheme}
                    className={`relative flex items-center w-14 h-7 rounded-full border-2 transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-primary border-primary'
                        : 'bg-surface-container-high border-outline-variant'
                    }`}
                    title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                      theme === 'dark'
                        ? 'translate-x-7 bg-on-primary text-primary'
                        : 'translate-x-0.5 bg-surface text-on-surface-variant'
                    }`}>
                      {theme === 'dark' ? <Moon size={11} /> : <Sun size={11} />}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="grow pt-16">{children}</main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant w-full py-12">
        <div className="max-w-page-max-width mx-auto px-gutter flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <Image src="/logo.png" alt="Expliq" width={24} height={24} className="dark:invert opacity-80" />
              <span className="font-serif font-bold text-lg text-on-surface">Expliq</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              India&apos;s go-to source for technology tutorials, reviews, career roadmaps, and digital earnings guides.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-2 mt-4">
              {[
                { label: 'X / Twitter', href: '#', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { label: 'YouTube', href: '#', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
                { label: 'Instagram', href: '#', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
                { label: 'LinkedIn', href: '#', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
              ].map(({ label, href, svg }) => (
                <a key={label} href={href} title={label} className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-colors">
                  {svg}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <h5 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-4">Content</h5>
              <ul className="space-y-2.5 text-xs text-on-surface-variant">
                <li><Link href="/ai-tools" className="hover:text-primary transition-colors">AI Tools</Link></li>
                <li><Link href="/devices" className="hover:text-primary transition-colors">Devices & Gadgets</Link></li>
                <li><Link href="/career" className="hover:text-primary transition-colors">Career Roadmaps</Link></li>
                <li><Link href="/student" className="hover:text-primary transition-colors">Student Earnings</Link></li>
                <li><Link href="/tech-news" className="hover:text-primary transition-colors">Tech News</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-4">Platform</h5>
              <ul className="space-y-2.5 text-xs text-on-surface-variant">
                <li><Link href="/tutorials" className="hover:text-primary transition-colors">Tutorials</Link></li>
                <li><Link href="/tools" className="hover:text-primary transition-colors">Interactive Tools</Link></li>
                <li><Link href="/search" className="hover:text-primary transition-colors">Search</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-page-max-width mx-auto px-gutter mt-10 pt-6 border-t border-outline-variant/30 text-center md:text-left text-xs text-on-surface-variant/70">
          © 2026 Expliq. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
