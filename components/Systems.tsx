'use client'

import { useEffect, useRef, useState } from 'react'

const architectureNodes = [
  {
    id: 'input',
    label: 'INPUT',
    sub: 'Enhanced Input System',
    color: 'cyan',
    x: 0,
  },
  {
    id: 'character',
    label: 'CHARACTER',
    sub: 'ACharacter + CMC',
    color: 'orange',
    x: 1,
  },
  {
    id: 'gas',
    label: 'ABILITY SYS',
    sub: 'GAS / UAbilityComp',
    color: 'cyan',
    x: 2,
  },
  {
    id: 'anim',
    label: 'ANIMATION',
    sub: 'Motion Matching',
    color: 'orange',
    x: 3,
  },
  {
    id: 'render',
    label: 'RENDER',
    sub: 'Lumen / Nanite',
    color: 'cyan',
    x: 4,
  },
]

const designPoints = [
  {
    q: 'GAS를 선택한 이유?',
    a: 'Tag 기반 상태 제어로 복잡한 조건 분기를 선언적으로 처리. 네트워크 복제를 위한 Prediction 구조가 내장되어 있어 멀티플레이 확장성 확보. AttributeSet으로 스탯 관리를 중앙화했습니다.',
    tag: 'DESIGN_DECISION',
  },
  {
    q: 'Motion Matching을 선택한 이유?',
    a: 'State Machine 기반 블렌딩의 복잡도 폭발 문제를 해결. Pose Database에서 가장 적합한 Pose를 비용 함수로 검색해 자연스러운 전환 구현. 애니메이션 추가 비용이 O(1)입니다.',
    tag: 'DESIGN_DECISION',
  },
  {
    q: '상태 관리 방식은?',
    a: 'GameplayTag 계층 구조(State.Combat.Attacking, State.Movement.Sprinting 등)로 상태를 표현. AbilitySystemComponent가 Tag 추가/제거를 브로드캐스트하면 각 시스템이 구독합니다.',
    tag: 'ARCHITECTURE',
  },
]

const codeSnippet = `// GAS - GameplayTag 기반 상태 체크
bool AMyCharacter::CanAttack() const
{
    // 공격 불가 태그가 없고 스태미나가 충분한 경우만 허용
    FGameplayTagContainer BlockTags;
    BlockTags.AddTag(TAG_State_Dead);
    BlockTags.AddTag(TAG_State_Stunned);
    BlockTags.AddTag(TAG_State_Casting);

    if (AbilitySystemComp->HasAnyMatchingGameplayTags(BlockTags))
        return false;

    // 스태미나 어트리뷰트 체크
    float Stamina = AbilitySystemComp->GetNumericAttribute(
        UMyAttributeSet::GetStaminaAttribute()
    );
    return Stamina > AttackStaminaCost;
}

// Motion Matching - Pose 선택 비용 함수
float UMMDatabase::ComputePoseCost(
    const FPoseInfo& Candidate,
    const FPoseSearchQuery& Query) const
{
    float PoseCost     = ComputePoseDifference(Candidate, Query) * PoseWeight;
    float TrajectoryCost = ComputeTrajectoryDiff(Candidate, Query) * TrajectoryWeight;
    float HistoryCost  = ComputeHistoryDiff(Candidate, Query)    * HistoryWeight;

    return PoseCost + TrajectoryCost + HistoryCost;
}`

export default function Systems() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [activePoint, setActivePoint] = useState(0)
  const [activeNode, setActiveNode] = useState<string | null>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="systems" className="relative py-32 bg-[var(--dark-card)]" ref={sectionRef}>
      <div className="glow-line w-full" />
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className={`mb-20 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="sys-tag">02 / SYSTEM ARCHITECTURE</div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--neon-cyan)] to-transparent opacity-30" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            SYSTEM <span className="text-[var(--neon-cyan)]">ARCHITECTURE</span>
          </h2>
          <p className="font-body text-white/50 max-w-2xl text-lg">
            어떻게 만들었는지, 왜 이렇게 설계했는지. 구조와 결정 배경을 설명합니다.
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className={`mb-16 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="neon-border bg-black/40 p-6 md:p-8">
            <div className="font-mono text-[10px] text-white/30 mb-6 tracking-widest">
              // SYSTEM FLOW DIAGRAM
            </div>

            {/* Flow nodes */}
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 md:flex-nowrap">
                {architectureNodes.map((node, i) => (
                  <div key={node.id} className="flex items-center flex-1 min-w-0">
                    <div
                      className={`group relative flex-1 text-center cursor-pointer transition-all duration-300 ${
                        activeNode === node.id ? 'scale-105' : 'hover:scale-102'
                      }`}
                      onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                    >
                      <div
                        className={`mx-auto mb-2 px-3 py-4 border transition-all duration-300 ${
                          activeNode === node.id
                            ? node.color === 'cyan'
                              ? 'border-[var(--neon-cyan)] bg-[rgba(0,255,240,0.1)] shadow-[0_0_20px_rgba(0,255,240,0.3)]'
                              : 'border-[var(--neon-orange)] bg-[rgba(241,90,36,0.1)] shadow-[0_0_20px_rgba(241,90,36,0.3)]'
                            : node.color === 'cyan'
                              ? 'border-[rgba(0,255,240,0.3)] hover:border-[rgba(0,255,240,0.6)]'
                              : 'border-[rgba(241,90,36,0.3)] hover:border-[rgba(241,90,36,0.6)]'
                        }`}
                      >
                        <div
                          className={`font-display font-bold text-sm mb-1 ${
                            node.color === 'cyan' ? 'text-[var(--neon-cyan)]' : 'text-[var(--neon-orange)]'
                          }`}
                        >
                          {node.label}
                        </div>
                        <div className="font-mono text-[9px] text-white/40 truncate">{node.sub}</div>
                      </div>
                    </div>

                    {/* Arrow */}
                    {i < architectureNodes.length - 1 && (
                      <div className="flex-shrink-0 px-1 md:px-2">
                        <div className="flex items-center gap-0.5">
                          <div className="h-[1px] w-4 md:w-8 bg-gradient-to-r from-[rgba(0,255,240,0.5)] to-[rgba(0,255,240,0.8)]" />
                          <div className="w-0 h-0 border-l-[6px] border-l-[rgba(0,255,240,0.8)] border-y-[3px] border-y-transparent" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Node detail */}
              {activeNode && (
                <div className="mt-6 p-4 border border-[rgba(0,255,240,0.2)] bg-[rgba(0,255,240,0.03)]">
                  {activeNode === 'input' && (
                    <div className="font-mono text-sm text-white/70">
                      <span className="text-[var(--neon-cyan)]">Enhanced Input System</span> — UInputMappingContext로 입력 맵핑 관리.
                      IEnhancedInputSubsystemInterface를 통해 런타임에 Input Context 동적 교체.
                      Action별로 Trigger 타입(Press/Hold/Release)을 분리해 입력 의도를 명확히 표현.
                    </div>
                  )}
                  {activeNode === 'character' && (
                    <div className="font-mono text-sm text-white/70">
                      <span className="text-[var(--neon-cyan)]">Character Movement Component</span> 확장 — 커스텀 이동 모드 추가
                      (Sprinting, Crouching, Climbing). Prediction을 깨지 않도록 SafeMoveUpdatedComponent 사용.
                      회전은 FMath::RInterpTo로 부드럽게 처리.
                    </div>
                  )}
                  {activeNode === 'gas' && (
                    <div className="font-mono text-sm text-white/70">
                      <span className="text-[var(--neon-cyan)]">Gameplay Ability System</span> — UAbilitySystemComponent를 Character에 부착.
                      AttributeSet(Health, Stamina, AttackPower)으로 스탯 관리. SetByCaller로 런타임 값 전달.
                      GameplayEffect로 버프/디버프/쿨타임 통합 관리.
                    </div>
                  )}
                  {activeNode === 'anim' && (
                    <div className="font-mono text-sm text-white/70">
                      <span className="text-[var(--neon-cyan)]">Motion Matching</span> — Pose Search Schema 정의 후 Pose Database 구성.
                      UPoseSearchLibrary::UpdateMotionMatchingState로 매 프레임 최적 Pose 검색.
                      비용 함수 가중치 튜닝으로 반응성과 자연스러움 균형 조절.
                    </div>
                  )}
                  {activeNode === 'render' && (
                    <div className="font-mono text-sm text-white/70">
                      <span className="text-[var(--neon-cyan)]">Lumen + Nanite</span> — Dynamic GI를 Lumen으로 처리.
                      Nanite로 고폴리 메시의 LOD 자동화. Scalability 설정으로 저사양 대응.
                      Shadow Distance Culling으로 불필요한 그림자 연산 제거.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Design Decisions */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Q&A accordion */}
          <div className={`transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-6 bg-[var(--neon-orange)]" />
              <span className="font-mono text-xs text-white/40 tracking-widest">DESIGN DECISIONS</span>
            </div>

            <div className="space-y-3">
              {designPoints.map((pt, i) => (
                <div
                  key={i}
                  className={`neon-border-orange bg-[var(--dark-card)] cursor-pointer transition-all duration-300 overflow-hidden`}
                  onClick={() => setActivePoint(activePoint === i ? -1 : i)}
                >
                  <div className="p-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="sys-tag text-[8px] border-[rgba(241,90,36,0.4)] text-[var(--neon-orange)] bg-[rgba(241,90,36,0.05)] mb-2">
                        {pt.tag}
                      </div>
                      <span className="font-display text-sm font-bold text-white">{pt.q}</span>
                    </div>
                    <span className={`text-[var(--neon-cyan)] font-mono text-lg flex-shrink-0 transition-transform duration-300 ${activePoint === i ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </div>
                  {activePoint === i && (
                    <div className="px-4 pb-4">
                      <div className="h-[1px] bg-[rgba(241,90,36,0.2)] mb-3" />
                      <p className="font-body text-white/60 text-sm leading-relaxed">{pt.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Code snippet */}
          <div className={`transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-6 bg-[var(--neon-cyan)]" />
              <span className="font-mono text-xs text-white/40 tracking-widest">CODE SAMPLE</span>
            </div>

            <div className="neon-border bg-black/60 overflow-hidden">
              {/* File tab */}
              <div className="flex items-center gap-0 border-b border-[rgba(0,255,240,0.15)]">
                <div className="px-4 py-2 bg-[rgba(0,255,240,0.05)] border-r border-[rgba(0,255,240,0.15)] border-b-[var(--neon-cyan)] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--neon-cyan)]" />
                  <span className="font-mono text-[10px] text-[var(--neon-cyan)]">MyCharacter.cpp</span>
                </div>
                <div className="px-4 py-2 flex items-center gap-2 opacity-40">
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                  <span className="font-mono text-[10px] text-white/50">MMDatabase.cpp</span>
                </div>
              </div>

              {/* Code */}
              <div className="code-block overflow-x-auto">
                {codeSnippet.split('\n').map((line, i) => (
                  <div key={i} className="flex gap-4 min-w-0">
                    <span className="text-white/20 select-none w-5 text-right flex-shrink-0">
                      {i + 1}
                    </span>
                    <span
                      className={
                        line.trim().startsWith('//')
                          ? 'text-green-400/60'
                          : line.includes('return')
                          ? 'text-[var(--neon-orange)]'
                          : line.includes('float') || line.includes('bool') || line.includes('void')
                          ? 'text-[var(--neon-cyan)]'
                          : 'text-white/80'
                      }
                    >
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}