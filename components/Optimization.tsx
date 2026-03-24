'use client'

import { useEffect, useRef, useState } from 'react'

const optimizations = [
  {
    id: 'drawcall',
    title: 'Draw Call 최적화',
    tag: 'RENDERING',
    problem: 'stat RHI로 확인 시 캐릭터 Mesh Draw Call이 과다. 특히 장비 파츠가 많아질수록 선형 증가.',
    analysis: 'RenderDoc으로 분석한 결과 각 파츠가 독립 Draw Call을 발생시킴. Material Instance 공유 없이 각기 다른 파라미터 사용 중.',
    solution: 'Modular Mesh를 Merged Mesh로 전환 (USkeletalMeshMerge). Material Instance를 공유하고 Texture Array로 파츠별 텍스처 처리. 거리별 LOD 최적화.',
    before: { label: 'Draw Calls', value: 340, unit: 'calls/frame' },
    after: { label: 'Draw Calls', value: 95, unit: 'calls/frame' },
    improvement: '72% 감소',
    color: 'cyan',
  },
  {
    id: 'tick',
    title: 'Tick Cost 최적화',
    tag: 'CPU',
    problem: 'Tick 비용이 높아 60fps 유지 불가. stat unit 결과 Game Thread 16ms 초과 빈번히 발생.',
    analysis: 'dumpticks 명령으로 확인 시 불필요한 AI 컴포넌트, 파티클, 상태 체크 액터들이 매 프레임 Tick.',
    solution: 'bCanEverTick = false 기본화 후 필요 컴포넌트만 활성화. Primary Asset Tick 그룹 최적화. 거리 기반 Tick 주기 분산 (TickInterval 적용).',
    before: { label: 'Game Thread', value: 18.2, unit: 'ms' },
    after: { label: 'Game Thread', value: 7.8, unit: 'ms' },
    improvement: '57% 감소',
    color: 'orange',
  },
  {
    id: 'animation',
    title: 'Animation Budget 최적화',
    tag: 'ANIMATION',
    problem: '다수 NPC 존재 시 AnimGraph 연산 비용 급증. 화면 밖 NPC도 동일 품질로 연산.',
    analysis: 'Unreal Insights로 AnimGraph 스레드 비용 확인. 화면 밖 15개 NPC가 Motion Matching 연산 수행 중.',
    solution: 'AnimBudgetAllocator 플러그인 활성화. 거리/화면 점유율에 따라 AnimGraph 연산 품질 자동 조절. Significance Manager와 연동.',
    before: { label: 'Anim Thread', value: 12.4, unit: 'ms' },
    after: { label: 'Anim Thread', value: 4.1, unit: 'ms' },
    improvement: '67% 감소',
    color: 'cyan',
  },
]

const tools = [
  { name: 'stat unit', desc: 'Game/Render/RHI 스레드 시간 실시간 모니터링' },
  { name: 'stat RHI', desc: 'Draw Primitive Call 수 및 삼각형 수 확인' },
  { name: 'dumpticks', desc: '현재 Tick 중인 액터 전체 목록 + 시간 덤프' },
  { name: 'Unreal Insights', desc: 'CPU/GPU 프레임 타임라인 세부 분석' },
  { name: 'RenderDoc', desc: 'GPU 드로콜 캡처 및 셰이더 분석' },
  { name: 'ProfileGPU', desc: 'GPU 연산 구간별 비용 분석' },
]

function BarComparison({ before, after, visible }: { before: number; after: number; visible: boolean }) {
  const maxVal = Math.max(before, after) * 1.2
  const beforePct = (before / maxVal) * 100
  const afterPct = (after / maxVal) * 100

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between mb-1">
          <span className="font-mono text-[10px] text-red-400/70">BEFORE</span>
          <span className="font-mono text-[10px] text-red-400">{before}</span>
        </div>
        <div className="h-3 bg-black/50 border border-[rgba(255,100,100,0.2)] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1500 ease-out"
            style={{ width: visible ? `${beforePct}%` : '0%', transitionDelay: '0.3s' }}
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-1">
          <span className="font-mono text-[10px] text-[var(--neon-cyan)]/70">AFTER</span>
          <span className="font-mono text-[10px] text-[var(--neon-cyan)]">{after}</span>
        </div>
        <div className="h-3 bg-black/50 border border-[rgba(0,255,240,0.2)] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--neon-cyan)] to-cyan-400 transition-all duration-1500 ease-out"
            style={{ width: visible ? `${afterPct}%` : '0%', transitionDelay: '0.6s' }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Optimization() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState<string | null>('drawcall')

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="optimization" className="relative py-32 bg-[var(--dark-card)]" ref={sectionRef}>
      <div className="glow-line w-full" />
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className={`mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="sys-tag">04 / OPTIMIZATION</div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--neon-cyan)] to-transparent opacity-30" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            PERFORMANCE <span className="text-[var(--neon-cyan)]">OPTIMIZATION</span>
          </h2>
          <p className="font-body text-white/50 max-w-2xl text-lg">
            느낌이 아닌 수치로. 측정하고, 분석하고, 해결하고, 검증합니다.
          </p>
        </div>

        {/* Summary stats */}
        <div className={`grid grid-cols-3 gap-4 mb-16 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { value: '72%', label: 'Draw Call 감소', sub: '340 → 95 calls' },
            { value: '57%', label: 'CPU 비용 절감', sub: '18.2ms → 7.8ms' },
            { value: '67%', label: 'Anim Thread 감소', sub: '12.4ms → 4.1ms' },
          ].map((s) => (
            <div key={s.label} className="neon-border bg-black/40 p-4 md:p-6 text-center">
              <div className="font-display text-3xl md:text-4xl font-black text-[var(--neon-cyan)] mb-1">
                {s.value}
              </div>
              <div className="font-mono text-xs text-white/60 tracking-widest mb-1">{s.label}</div>
              <div className="font-mono text-[10px] text-white/30">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Optimization cases */}
        <div className={`mb-16 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="space-y-3">
            {optimizations.map((opt) => (
              <div
                key={opt.id}
                className={`border transition-all duration-300 ${
                  opt.color === 'cyan'
                    ? 'border-[rgba(0,255,240,0.2)] hover:border-[rgba(0,255,240,0.4)]'
                    : 'border-[rgba(241,90,36,0.2)] hover:border-[rgba(241,90,36,0.4)]'
                } bg-[var(--dark-card)]`}
              >
                {/* Header */}
                <div
                  className="p-5 flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpanded(expanded === opt.id ? null : opt.id)}
                >
                  <div className="flex-1 flex items-center gap-3 flex-wrap">
                    <span
                      className={`sys-tag text-[9px] ${
                        opt.color === 'cyan'
                          ? ''
                          : 'border-[rgba(241,90,36,0.5)] text-[var(--neon-orange)] bg-[rgba(241,90,36,0.05)]'
                      }`}
                    >
                      {opt.tag}
                    </span>
                    <span className="font-display font-bold text-white text-base">{opt.title}</span>
                  </div>
                  <div
                    className={`font-display font-black text-lg ${
                      opt.color === 'cyan' ? 'text-[var(--neon-cyan)]' : 'text-[var(--neon-orange)]'
                    }`}
                  >
                    {opt.improvement}
                  </div>
                  <span className={`font-mono text-xl text-white/40 transition-transform duration-300 ${expanded === opt.id ? 'rotate-45' : ''}`}>+</span>
                </div>

                {/* Expanded content */}
                {expanded === opt.id && (
                  <div className="border-t border-[rgba(255,255,255,0.05)]">
                    <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[rgba(255,255,255,0.05)]">
                      {/* Problem */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-red-400" />
                          <span className="font-mono text-[10px] text-red-400/70 tracking-widest">PROBLEM</span>
                        </div>
                        <p className="font-body text-white/50 text-sm leading-relaxed">{opt.problem}</p>
                        <div className="mt-3 p-2 bg-black/40 border-l-2 border-red-400/40">
                          <code className="font-mono text-[10px] text-red-300/70">
                            {opt.id === 'drawcall' && '// stat RHI 결과\nDraw Primitive Calls: 340'}
                            {opt.id === 'tick' && '// stat unit 결과\nGame: 18.2ms (Target: <8ms)'}
                            {opt.id === 'animation' && '// Unreal Insights\nAnimThread: 12.4ms peak'}
                          </code>
                        </div>
                      </div>

                      {/* Analysis */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-yellow-400" />
                          <span className="font-mono text-[10px] text-yellow-400/70 tracking-widest">ANALYSIS</span>
                        </div>
                        <p className="font-body text-white/50 text-sm leading-relaxed">{opt.analysis}</p>
                        <div className="mt-3">
                          <BarComparison
                            before={opt.before.value}
                            after={opt.after.value}
                            visible={expanded === opt.id && visible}
                          />
                          <div className="font-mono text-[9px] text-white/30 mt-1 text-right">{opt.before.unit}</div>
                        </div>
                      </div>

                      {/* Solution */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-[var(--neon-cyan)]" />
                          <span className="font-mono text-[10px] text-[var(--neon-cyan)]/70 tracking-widest">SOLUTION</span>
                        </div>
                        <p className="font-body text-white/50 text-sm leading-relaxed">{opt.solution}</p>
                        <div className="mt-3 p-2 bg-[rgba(0,255,240,0.03)] border-l-2 border-[rgba(0,255,240,0.4)]">
                          <code className="font-mono text-[10px] text-[var(--neon-cyan)]/70">
                            {opt.id === 'drawcall' && '// 결과\nDraw Calls: 340 → 95\n개선: 72% 감소'}
                            {opt.id === 'tick' && '// 결과\nGame Thread: 18.2 → 7.8ms\n개선: 57% 감소'}
                            {opt.id === 'animation' && '// 결과\nAnimThread: 12.4 → 4.1ms\n개선: 67% 감소'}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Profiling Tools */}
        <div className={`transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-8 bg-[var(--neon-cyan)]" />
            <span className="font-mono text-xs text-white/40 tracking-widest">PROFILING TOOLS USED</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tools.map((tool) => (
              <div key={tool.name} className="neon-border bg-black/30 p-4">
                <div className="font-mono text-sm text-[var(--neon-cyan)] mb-2 cursor-blink-none">{tool.name}</div>
                <p className="font-body text-white/40 text-xs leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}