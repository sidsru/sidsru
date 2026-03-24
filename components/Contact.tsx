'use client'

import { useEffect, useRef, useState } from 'react'

const techStack = [
  { cat: 'ENGINE', items: ['Unreal Engine 5.4', 'Unreal Engine 4.27'] },
  { cat: 'LANGUAGE', items: ['C++', 'Blueprints'] },
  { cat: 'SYSTEMS', items: ['Gameplay Ability System', 'Motion Matching', 'Enhanced Input', 'Character Movement'] },
  { cat: 'TOOLS', items: ['Unreal Insights', 'RenderDoc', 'Visual Studio 2022', 'Git / Perforce'] },
]

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('your.email@example.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="relative py-32 bg-[var(--dark-card)]" ref={sectionRef}>
      <div className="glow-line w-full" />

      {/* Background decoration */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[rgba(0,255,240,0.03)] blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className={`mb-20 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="sys-tag">06 / CONNECT</div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--neon-cyan)] to-transparent opacity-30" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            CONNECT<span className="text-[var(--neon-cyan)]">.exe</span>
          </h2>
          <p className="font-body text-white/50 max-w-2xl text-lg">
            함께 더 좋은 게임을 만들어 갈 팀을 찾고 있습니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Left: Contact */}
          <div className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Status */}
            <div className="neon-border bg-black/40 p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
                <span className="font-mono text-xs text-green-400 tracking-widest">ACTIVELY_SEEKING</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'POSITION', value: 'Unreal Engine 클라이언트 개발자' },
                  { label: 'TYPE', value: '정규직 / 계약직 모두 가능' },
                  { label: 'LOCATION', value: '서울 / 원격 가능' },
                  { label: 'AVAILABLE', value: '즉시 입사 가능' },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 items-start">
                    <span className="font-mono text-[10px] text-white/30 tracking-widest w-20 flex-shrink-0 pt-0.5">{item.label}</span>
                    <span className="font-body text-white/70 text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="space-y-3">
              {[
                {
                  platform: 'EMAIL',
                  value: 'your.email@example.com',
                  icon: '✉',
                  action: handleCopyEmail,
                  actionLabel: copied ? 'COPIED!' : 'COPY',
                },
                {
                  platform: 'GITHUB',
                  value: 'github.com/yourname',
                  icon: '◈',
                  action: () => window.open('https://github.com/yourname', '_blank'),
                  actionLabel: 'OPEN',
                },
                {
                  platform: 'NOTION',
                  value: 'notion 포트폴리오 링크',
                  icon: '◉',
                  action: () => {},
                  actionLabel: 'OPEN',
                },
              ].map((link) => (
                <div
                  key={link.platform}
                  className="neon-border bg-black/30 p-4 flex items-center gap-4 hover:bg-[rgba(0,255,240,0.03)] transition-all duration-300 group"
                >
                  <span className="text-[var(--neon-cyan)] text-xl w-8 text-center">{link.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[9px] text-white/30 tracking-widest mb-0.5">{link.platform}</div>
                    <div className="font-body text-white/70 text-sm truncate">{link.value}</div>
                  </div>
                  <button
                    onClick={link.action}
                    className="font-mono text-[10px] text-[var(--neon-cyan)] border border-[rgba(0,255,240,0.3)] px-3 py-1.5 hover:bg-[rgba(0,255,240,0.1)] transition-all flex-shrink-0"
                  >
                    {link.platform === 'EMAIL' ? link.actionLabel : '→ OPEN'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Tech stack */}
          <div className={`transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-6 bg-[var(--neon-orange)]" />
              <span className="font-mono text-xs text-white/40 tracking-widest">TECH STACK</span>
            </div>

            <div className="space-y-5">
              {techStack.map((cat) => (
                <div key={cat.cat}>
                  <div className="font-mono text-[10px] text-[var(--neon-orange)]/70 tracking-widest mb-3">
                    // {cat.cat}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <span
                        key={item}
                        className="font-mono text-[11px] px-3 py-1.5 border border-[rgba(0,255,240,0.2)] text-white/60 hover:border-[rgba(0,255,240,0.5)] hover:text-[var(--neon-cyan)] transition-all duration-300 cursor-default"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Skills visual */}
            <div className="mt-8 space-y-3">
              <div className="font-mono text-[10px] text-white/30 tracking-widest mb-4">// PROFICIENCY</div>
              {[
                { skill: 'Unreal Engine C++', pct: 88 },
                { skill: 'Gameplay Ability System', pct: 82 },
                { skill: 'Animation / Motion Matching', pct: 75 },
                { skill: 'Performance Optimization', pct: 78 },
                { skill: 'Network / Replication', pct: 62 },
              ].map((s) => (
                <div key={s.skill}>
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-[10px] text-white/50">{s.skill}</span>
                    <span className="font-mono text-[10px] text-[var(--neon-cyan)]">{s.pct}%</span>
                  </div>
                  <div className="h-1 bg-black/50 border border-[rgba(0,255,240,0.1)] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-cyan-300 transition-all duration-1000 ease-out"
                      style={{
                        width: visible ? `${s.pct}%` : '0%',
                        transitionDelay: '0.5s',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[rgba(0,255,240,0.1)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-[11px] text-white/20 tracking-widest">
            © 2024 PARK.DEV — UNREAL ENGINE CLIENT PROGRAMMER
          </div>
          <div className="font-mono text-[10px] text-white/20 tracking-widest">
            BUILT WITH NEXT.JS + TAILWIND CSS
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[10px] text-green-400/50 tracking-widest">ALL_SYSTEMS_ONLINE</span>
          </div>
        </div>
      </div>
    </section>
  )
}