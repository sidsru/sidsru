'use client'

import { useEffect, useRef, useState } from 'react'

const features = [
  {
    icon: '⚡',
    title: 'Gameplay Ability System',
    desc: 'GAS 기반 스킬/쿨타임/버프 시스템. SetByCaller + Tag 기반 상태 제어로 확장성 확보.',
    tag: 'GAS',
  },
  {
    icon: '🎭',
    title: 'Motion Matching',
    desc: 'Pose Database 기반 자연스러운 전환. 직접 구현한 Pose 검색 알고리즘으로 전이 비용 최소화.',
    tag: 'ANIMATION',
  },
  {
    icon: '🎮',
    title: 'Custom Movement',
    desc: '상태 머신 기반 캐릭터 이동 시스템. 회전 보간, 가속도 커브, 지형 적응 구현.',
    tag: 'MOVEMENT',
  },
  {
    icon: '📊',
    title: 'Performance Profiling',
    desc: 'Unreal Insights + stat unit 기반 병목 분석. Draw Call 30% 감소, Tick Cost 최적화.',
    tag: 'OPTIMIZE',
  },
  {
    icon: '🔧',
    title: 'Debug System',
    desc: '실시간 Tag 상태 시각화, 쿨타임 UI 오버레이, 히트박스 디버그 렌더링 구현.',
    tag: 'TOOL',
  },
  {
    icon: '⚔️',
    title: 'Combat System',
    desc: 'Ability Task 기반 콤보 체인. 타격감을 위한 카메라 쉐이크, 히트스톱, 이펙트 연동.',
    tag: 'COMBAT',
  },
]

const timeline = [
  { phase: 'PHASE 01', label: 'CHARACTER BASE', desc: '이동, 카메라, 기본 입력 시스템 구축', done: true },
  { phase: 'PHASE 02', label: 'ANIMATION SYS', desc: 'Motion Matching 파이프라인 통합', done: true },
  { phase: 'PHASE 03', label: 'ABILITY SYS', desc: 'GAS 기반 스킬 / 상태 시스템 구현', done: true },
  { phase: 'PHASE 04', label: 'COMBAT LOOP', desc: '전투, 피격, 피니셔 시스템 완성', done: true },
  { phase: 'PHASE 05', label: 'OPTIMIZE', desc: 'Profiling 기반 성능 최적화', done: false },
]

export default function Overview() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="overview" className="relative py-32 bg-[#050508]" ref={sectionRef}>
      {/* Top glow line */}
      <div className="glow-line w-full mb-0" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className={`mb-20 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="sys-tag border-[rgba(241,90,36,0.5)] text-[var(--neon-orange)] bg-[rgba(241,90,36,0.05)]">
              01 / OVERVIEW
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--neon-orange)] to-transparent opacity-30" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            PROJECT <span className="text-[var(--neon-cyan)]">OVERVIEW</span>
          </h2>
          <p className="font-body text-white/50 max-w-2xl text-lg leading-relaxed">
            단순한 캐릭터가 아닙니다. Unreal Engine 5의 핵심 시스템을 깊이 이해하고
            설계부터 최적화까지 직접 구현한 기술 데모입니다.
          </p>
        </div>

        {/* Video placeholder + feature list */}
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {/* Video area */}
          <div
            className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
          >
            <div className="neon-border bg-black/40 aspect-video flex flex-col items-center justify-center relative overflow-hidden group">
              {/* Fake video player */}
              <div className="absolute inset-0 grid-bg opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-[var(--neon-cyan)] flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 cursor-pointer relative">
                    <div className="w-0 h-0 border-l-[28px] border-l-[var(--neon-cyan)] border-y-[18px] border-y-transparent ml-2" />
                    <div className="absolute inset-0 rounded-full border border-[var(--neon-cyan)] animate-ping opacity-20" />
                  </div>
                  <p className="font-mono text-[11px] text-white/40 tracking-widest">
                    DEMO_VIDEO.mp4
                  </p>
                  <p className="font-mono text-[9px] text-white/20 tracking-widest mt-1">
                    [여기에 플레이 영상 삽입]
                  </p>
                </div>
              </div>
              {/* Corner tags */}
              <div className="absolute top-3 left-3 sys-tag text-[8px]">LIVE_DEMO</div>
              <div className="absolute top-3 right-3 font-mono text-[9px] text-red-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                REC
              </div>
              <div className="absolute bottom-3 left-3 font-mono text-[9px] text-white/30">
                UE5 | C++ | 60fps
              </div>
            </div>

            {/* Key features quick list */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {['이동 시스템', '전투 시스템', '스킬 시스템', '피격 반응', '상태 머신', '최적화'].map((f) => (
                <div key={f} className="bg-[var(--dark-card)] border border-[rgba(0,255,240,0.1)] px-2 py-1.5 text-center">
                  <span className="font-mono text-[9px] text-white/50 tracking-wider">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature cards */}
          <div
            className={`transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
          >
            <div className="grid grid-cols-1 gap-3">
              {features.map((feat, i) => (
                <div
                  key={feat.title}
                  className="neon-border bg-[var(--dark-card)] p-4 flex gap-4 hover:bg-[rgba(0,255,240,0.03)] transition-all duration-300 group"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {feat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-sm font-bold text-white">{feat.title}</span>
                      <span className="sys-tag text-[8px] ml-auto">{feat.tag}</span>
                    </div>
                    <p className="font-body text-white/50 text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Development timeline */}
        <div className={`transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-8 bg-[var(--neon-cyan)]" />
            <span className="font-mono text-xs text-white/40 tracking-widest">DEVELOPMENT TIMELINE</span>
          </div>

          <div className="relative">
            {/* Line */}
            <div className="absolute top-4 left-0 right-0 h-[1px] bg-[rgba(0,255,240,0.15)]" />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {timeline.map((t, i) => (
                <div key={t.phase} className="relative pt-10 group">
                  {/* Dot */}
                  <div
                    className={`absolute top-2.5 left-6 w-3 h-3 -translate-y-1/2 -translate-x-1/2 border-2 transition-all duration-300 ${
                      t.done
                        ? 'bg-[var(--neon-cyan)] border-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]'
                        : 'bg-transparent border-white/20 group-hover:border-[var(--neon-orange)]'
                    }`}
                  />
                  <span className="font-mono text-[9px] text-white/30 tracking-widest block mb-1">{t.phase}</span>
                  <span
                    className={`font-display text-xs font-bold block mb-1 ${t.done ? 'text-[var(--neon-cyan)]' : 'text-white/40'}`}
                  >
                    {t.label}
                  </span>
                  <span className="font-body text-[11px] text-white/30 leading-tight">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}