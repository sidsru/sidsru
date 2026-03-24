'use client'

import { useState, useEffect } from 'react'

const navItems = [
  { id: 'hero', label: 'INIT' },
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'systems', label: 'SYSTEM' },
  { id: 'deepdive', label: 'DEEP_DIVE' },
  { id: 'optimization', label: 'OPTIMIZE' },
  { id: 'problems', label: 'DEBUG_LOG' },
  { id: 'contact', label: 'CONNECT' },
]

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('hero')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = navItems.map(item => document.getElementById(item.id))
      const scrollPos = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-md border-b border-[rgba(0,255,240,0.15)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 border border-[var(--neon-cyan)] rotate-45 opacity-70" />
              <div className="absolute inset-1 border border-[var(--neon-orange)] rotate-45 opacity-50" />
              <div className="absolute inset-[6px] bg-[var(--neon-cyan)] rotate-45" />
            </div>
            <div>
              <div
                className="text-white font-display text-sm font-bold tracking-widest cursor-pointer"
                onClick={() => scrollTo('hero')}
              >
                DEV<span className="text-[var(--neon-cyan)]">.EXE</span>
              </div>
              <div className="text-[8px] font-mono text-[var(--neon-cyan)]/50 tracking-[0.3em]">
                UNREAL_CLIENT_ENGINEER
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`relative px-4 py-2 font-mono text-[10px] tracking-[0.2em] transition-all duration-300 group ${
                  activeSection === item.id
                    ? 'text-[var(--neon-cyan)]'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {activeSection === item.id && (
                  <span className="absolute left-2 text-[var(--neon-cyan)] opacity-60">{'>'}</span>
                )}
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-[1px] bg-[var(--neon-cyan)] transition-all duration-300 ${
                    activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Status indicator */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] text-green-400/70 tracking-widest">ONLINE</span>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-6 h-[1px] bg-[var(--neon-cyan)] transition-all ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-[1px] bg-[var(--neon-cyan)] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[1px] bg-[var(--neon-cyan)] transition-all ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden border-t border-[rgba(0,255,240,0.15)] bg-black/95 transition-all duration-300 overflow-hidden ${
            menuOpen ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <div className="p-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-left font-mono text-xs tracking-widest py-2 px-4 border-l-2 transition-all ${
                  activeSection === item.id
                    ? 'border-[var(--neon-cyan)] text-[var(--neon-cyan)]'
                    : 'border-transparent text-white/40'
                }`}
              >
                {activeSection === item.id ? '> ' : '  '}{item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Side progress indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="group flex items-center gap-2"
            title={item.label}
          >
            <span
              className={`text-[8px] font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-[var(--neon-cyan)] whitespace-nowrap`}
            >
              {item.label}
            </span>
            <div
              className={`transition-all duration-300 rounded-full ${
                activeSection === item.id
                  ? 'w-3 h-3 bg-[var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)]'
                  : 'w-1.5 h-1.5 bg-white/20 group-hover:bg-white/50'
              }`}
            />
          </button>
        ))}
      </div>
    </>
  )
}