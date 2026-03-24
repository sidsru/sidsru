'use client'

import { useEffect, useRef, useState } from 'react'

const bootLines = [
  '> UNREAL_ENGINE_5.4 :: LOADED',
  '> C++ COMPILER :: READY',
  '> GAMEPLAY_ABILITY_SYSTEM :: ONLINE',
  '> MOTION_MATCHING_ENGINE :: INITIALIZED',
  '> OPTIMIZATION_PROFILER :: ACTIVE',
  '> PORTFOLIO_SYSTEM :: BOOT COMPLETE',
]

const keywords = [
  { label: 'Motion Matching', color: 'cyan' },
  { label: 'GAS', color: 'orange' },
  { label: 'C++ / UE5', color: 'cyan' },
  { label: 'Optimization', color: 'orange' },
  { label: 'Animation System', color: 'cyan' },
]

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [bootIndex, setBootIndex] = useState(0)
  const [showMain, setShowMain] = useState(false)
  const [typed, setTyped] = useState('')

  // Particle / radar animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[] = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        size: Math.random() * 1.5 + 0.3,
      })
    }

    let angle = 0
    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,255,240,${p.alpha})`
        ctx.fill()
      })

      // Connect close particles
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(0,255,240,${0.08 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      // Radar sweep
      const cx = canvas.width * 0.82
      const cy = canvas.height * 0.5
      const r = Math.min(canvas.width * 0.16, 140)
      angle += 0.012

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0,255,240,0.12)'
      ctx.lineWidth = 1
      ctx.stroke()

      ;[r * 0.66, r * 0.33].forEach((ir) => {
        ctx.beginPath()
        ctx.arc(cx, cy, ir, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(0,255,240,0.07)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      let grad: CanvasGradient | null = null;

      if (typeof ctx.createConicGradient === 'function') {
        grad = ctx.createConicGradient(angle, cx, cy);
        grad.addColorStop(0, 'rgba(0,255,240,0.4)');
        grad.addColorStop(0.2, 'rgba(0,255,240,0.15)');
        grad.addColorStop(1, 'rgba(0,255,240,0)');
      }
      
      if (grad) {
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle - 0.5, angle);
        ctx.closePath();
        ctx.fill();
      } else {
        // fallback
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
        ctx.strokeStyle = 'rgba(0,255,240,0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      if (!grad) {
        // fallback sweep line
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r)
        ctx.strokeStyle = 'rgba(0,255,240,0.5)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Radar sweep arc fallback
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)
      const sweepGrad = ctx.createLinearGradient(0, 0, r, 0)
      sweepGrad.addColorStop(0, 'rgba(0,255,240,0.4)')
      sweepGrad.addColorStop(1, 'rgba(0,255,240,0)')
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, r, -0.5, 0)
      ctx.closePath()
      ctx.fillStyle = sweepGrad
      ctx.fill()
      ctx.restore()

      // Grid crosshairs
      ctx.beginPath()
      ctx.moveTo(cx - r, cy)
      ctx.lineTo(cx + r, cy)
      ctx.moveTo(cx, cy - r)
      ctx.lineTo(cx, cy + r)
      ctx.strokeStyle = 'rgba(0,255,240,0.1)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Blip dots
      const blips = [
        { angle: 0.8, dist: 0.5 },
        { angle: 2.3, dist: 0.75 },
        { angle: 4.1, dist: 0.4 },
      ]
      blips.forEach((b) => {
        const bx = cx + Math.cos(b.angle) * r * b.dist
        const by = cy + Math.sin(b.angle) * r * b.dist
        ctx.beginPath()
        ctx.arc(bx, by, 2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(241,90,36,0.8)'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(bx, by, 5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(241,90,36,0.15)'
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Boot sequence
  useEffect(() => {
    if (bootIndex < bootLines.length) {
      const t = setTimeout(() => setBootIndex(bootIndex + 1), 300)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setShowMain(true), 400)
      return () => clearTimeout(t)
    }
  }, [bootIndex])

  // Typewriter for role
  useEffect(() => {
    if (!showMain) return
    const text = 'Unreal Engine Client Programmer'
    let i = 0
    const t = setInterval(() => {
      setTyped(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(t)
    }, 50)
    return () => clearInterval(t)
  }, [showMain])

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden grid-bg">
      {/* Scan line */}
      <div className="scan-overlay" />

      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050508] via-transparent to-[#050508]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050508] to-transparent" />

      {/* Decorative corner brackets */}
      {['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-10 h-10 hidden md:block`}>
          <div
            className="w-full h-full border-[var(--neon-cyan)] opacity-30"
            style={{
              borderTopWidth: i < 2 ? '1px' : '0',
              borderBottomWidth: i >= 2 ? '1px' : '0',
              borderLeftWidth: i % 2 === 0 ? '1px' : '0',
              borderRightWidth: i % 2 === 1 ? '1px' : '0',
            }}
          />
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        {/* Boot terminal */}
        <div className="mb-12 neon-border bg-black/40 p-4 max-w-lg">
          <div className="flex items-center gap-2 mb-3 border-b border-[rgba(0,255,240,0.1)] pb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="font-mono text-[10px] text-white/30 ml-2 tracking-widest">SYSTEM_BOOT.exe</span>
          </div>
          {bootLines.slice(0, bootIndex).map((line, i) => (
            <div key={i} className="font-mono text-[11px] text-[var(--neon-cyan)]/70 leading-6">
              {line}
            </div>
          ))}
          {bootIndex < bootLines.length && (
            <div className="font-mono text-[11px] text-[var(--neon-cyan)]/40">
              {'> '}<span className="animate-pulse">█</span>
            </div>
          )}
        </div>

        {/* Main hero content */}
        <div
          className={`transition-all duration-700 ${showMain ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Eyebrow label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-[var(--neon-cyan)]" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-[var(--neon-cyan)] uppercase">
              Portfolio v2.0.1
            </span>
            <div className="sys-tag">AVAILABLE</div>
          </div>

          {/* Name */}
          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white mb-2 leading-none">
            <span
              className="glitch-text inline-block"
              data-text="PARK"
            >
              PARK
            </span>
            <span className="text-[var(--neon-cyan)]">.</span>
            <br />
            <span className="text-white/80">DEV</span>
          </h1>

          {/* Role typewriter */}
          <div className="font-mono text-lg md:text-xl text-[var(--neon-orange)] mb-8 h-8">
            {'> '}{typed}
            <span className="inline-block w-2 h-5 bg-[var(--neon-orange)] ml-0.5 animate-pulse align-middle" />
          </div>

          {/* Keyword tags */}
          <div className="flex flex-wrap gap-3 mb-10">
            {keywords.map((kw) => (
              <div
                key={kw.label}
                className={`sys-tag ${kw.color === 'orange' ? 'border-[rgba(241,90,36,0.5)] text-[var(--neon-orange)] bg-[rgba(241,90,36,0.05)]' : ''}`}
              >
                {kw.label}
              </div>
            ))}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 max-w-2xl">
            {[
              { value: '3+', label: 'Years UE Dev' },
              { value: '60fps', label: 'Target Perf' },
              { value: '40%', label: 'Perf Gained' },
              { value: 'UE5', label: 'Engine Ver' },
            ].map((stat) => (
              <div key={stat.label} className="neon-border bg-black/40 p-3 text-center">
                <div className="font-display text-2xl text-[var(--neon-cyan)] font-bold">{stat.value}</div>
                <div className="font-mono text-[9px] text-white/40 tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => document.getElementById('systems')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-8 py-3 font-mono text-sm tracking-widest text-black bg-[var(--neon-cyan)] hover:bg-white transition-colors duration-300 overflow-hidden"
            >
              <span className="relative z-10">EXPLORE_SYSTEMS</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 font-mono text-sm tracking-widest text-[var(--neon-cyan)] border border-[rgba(0,255,240,0.4)] hover:border-[var(--neon-cyan)] hover:bg-[rgba(0,255,240,0.05)] transition-all duration-300"
            >
              CONTACT.exe
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/30">SCROLL</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[var(--neon-cyan)] to-transparent" />
      </div>
    </section>
  )
}