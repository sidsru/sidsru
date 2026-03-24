'use client'

import { useEffect, useRef, useState } from 'react'

const problems = [
  {
    id: 'cooldown',
    severity: 'HIGH',
    title: '쿨타임이 적용되지 않던 문제',
    tag: 'GAS / BUG',
    symptom: '스킬 사용 후 쿨타임 UI는 표시되지만, 다시 즉시 사용 가능한 상태가 되는 버그 발생.',
    cause: `ApplyCooldown에서 GameplayEffect를 올바르게 적용했지만, CanActivateAbility 체크 시
BlockAbilitiesWithTag가 아닌 ActivationOwnedTags를 사용해 Tag 체크가 충돌.
쿨타임 GE가 추가한 Cooldown.Skill.Attack 태그를 ActivationBlockedTags에서
인식하지 못함.`,
    solution: `// 문제 코드
AbilityTags.AddTag(TAG_Ability_Attack);  // 잘못된 위치

// 수정 코드 - CooldownGameplayEffectClass의 GrantedTags 설정
void UMyAbility_Attack::GetCooldownTags(
    FGameplayTagContainer& Tags) const
{
    // 부모 태그 포함
    Super::GetCooldownTags(Tags);
    // 쿨타임 GE가 부여할 태그 명시적 등록
    Tags.AddTag(TAG_Cooldown_Skill_Attack);
}`,
    lesson: 'GAS의 Tag 흐름(Owned → Blocked → Required)을 정확히 이해하지 않으면 보이지 않는 곳에서 버그 발생. GE 적용 시 LogAbilitySystem 로그로 Tag 변화를 추적하는 습관이 필요.',
  },
  {
    id: 'playerstart',
    severity: 'MED',
    title: 'PlayerStart 위치 문제로 폴아웃 발생',
    tag: 'LEVEL / SPAWN',
    symptom: '특정 맵에서 게임 시작 시 캐릭터가 바닥을 뚫고 추락. CollisionVolume 오버랩 경고 반복.',
    cause: `PlayerStart 액터의 높이가 네비게이션 메시 재빌드 후 지형과 미스매치.
NavMesh 재생성 시 PlayerStart가 지형 아래에 위치하게 됨.
캐릭터 스폰 시 LineTrace로 바닥을 찾지 않고 PlayerStart 위치를 직접 사용.`,
    solution: `// GameMode에서 스폰 위치 보정
AActor* AMyGameMode::ChoosePlayerStart_Implementation(
    AController* Player)
{
    AActor* ChosenStart = Super::ChoosePlayerStart_Implementation(Player);
    if (!ChosenStart) return nullptr;

    // 바닥까지 LineTrace로 안전한 위치 계산
    FHitResult Hit;
    FVector Start = ChosenStart->GetActorLocation() + FVector(0,0,200);
    FVector End   = Start - FVector(0,0,500);

    if (GetWorld()->LineTraceSingleByChannel(
        Hit, Start, End, ECC_WorldStatic))
    {
        ChosenStart->SetActorLocation(
            Hit.Location + FVector(0,0,90));  // 캡슐 높이 보정
    }
    return ChosenStart;
}`,
    lesson: 'NavMesh 재빌드 후에는 PlayerStart 위치를 항상 재확인. 스폰 시 바닥 검증 로직을 GameMode에 표준화해두면 반복 문제를 예방할 수 있다.',
  },
  {
    id: 'tick',
    severity: 'HIGH',
    title: 'Tick 폭증으로 인한 프레임 드롭',
    tag: 'PERFORMANCE / TICK',
    symptom: '특정 전투 구역 진입 시 프레임이 60 → 22fps로 급격히 하락. stat unit 결과 Game Thread 급증.',
    cause: `전투 구역에 적 스폰 시 각 적이 가진 디버그 드로잉 컴포넌트가 Tick 활성화됨.
개발 중 추가한 DrawDebugSphere 계열 함수가 Ship 빌드에서도 Tick마다 실행.
20명 적 기준 디버그 드로잉만으로 ~4ms 소모.`,
    solution: `// 조건부 컴파일로 Ship 빌드에서 제거
void UMyDebugComponent::TickComponent(
    float DeltaTime,
    ELevelTick TickType,
    FActorComponentTickFunction* ThisTickFunction)
{
#if WITH_EDITOR || UE_BUILD_DEVELOPMENT
    Super::TickComponent(DeltaTime, TickType, ThisTickFunction);
    DrawDebugState();
#endif

    // Ship 빌드에서 Tick 자체를 비활성화
    if (UE_BUILD_SHIPPING)
    {
        PrimaryComponentTick.bCanEverTick = false;
    }
}`,
    lesson: '개발용 디버그 코드는 반드시 WITH_EDITOR 또는 UE_BUILD_DEVELOPMENT 매크로로 감싸야 한다. "Debug" 접두사 컴포넌트는 자동 Tick 비활성화를 기본값으로 설정하는 규칙을 팀에 공유해야 한다.',
  },
]

const severityColor: Record<string, string> = {
  HIGH: 'text-red-400 border-red-400/50 bg-red-400/5',
  MED: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/5',
  LOW: 'text-green-400 border-green-400/50 bg-green-400/5',
}

export default function Problems() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState<string | null>('cooldown')

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="problems" className="relative py-32 bg-[#050508]" ref={sectionRef}>
      <div className="glow-line w-full" />
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className={`mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="sys-tag border-[rgba(241,90,36,0.5)] text-[var(--neon-orange)] bg-[rgba(241,90,36,0.05)]">
              05 / DEBUG LOG
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--neon-orange)] to-transparent opacity-30" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            PROBLEM <span className="text-[var(--neon-cyan)]">SOLVING</span>
          </h2>
          <p className="font-body text-white/50 max-w-2xl text-lg">
            실제로 겪은 문제들. 증상 → 원인 분석 → 해결 → 교훈까지. 이게 진짜 실무 능력입니다.
          </p>
        </div>

        {/* Terminal header decoration */}
        <div className={`mb-8 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="neon-border bg-black/60 p-3 flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <span className="font-mono text-[11px] text-white/30 tracking-widest flex-1 text-center">
              DEBUG_LOG.txt — {problems.length} entries found
            </span>
            <div className="font-mono text-[10px] text-red-400/60">{problems.filter(p => p.severity === 'HIGH').length} HIGH_PRIORITY</div>
          </div>
        </div>

        {/* Problem cards */}
        <div className={`space-y-4 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {problems.map((prob, i) => (
            <div
              key={prob.id}
              className="border border-[rgba(255,255,255,0.07)] bg-[var(--dark-card)] overflow-hidden"
            >
              {/* Card header */}
              <div
                className="p-5 flex items-center gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpanded(expanded === prob.id ? null : prob.id)}
              >
                {/* Entry number */}
                <div className="font-mono text-[10px] text-white/20 w-8 flex-shrink-0">
                  #{String(i + 1).padStart(3, '0')}
                </div>

                {/* Severity badge */}
                <div className={`font-mono text-[9px] px-2 py-1 border tracking-widest flex-shrink-0 ${severityColor[prob.severity]}`}>
                  {prob.severity}
                </div>

                {/* Tag */}
                <div className="sys-tag text-[9px] hidden md:block">{prob.tag}</div>

                {/* Title */}
                <span className="font-display font-bold text-white flex-1 min-w-0 truncate">
                  {prob.title}
                </span>

                {/* Toggle */}
                <span className={`font-mono text-xl text-white/40 flex-shrink-0 transition-transform duration-300 ${expanded === prob.id ? 'rotate-45' : ''}`}>
                  +
                </span>
              </div>

              {/* Expanded detail */}
              {expanded === prob.id && (
                <div className="border-t border-[rgba(255,255,255,0.05)]">
                  <div className="p-6 space-y-6">
                    {/* Symptom */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-red-400" />
                        <span className="font-mono text-[10px] text-red-400/70 tracking-widest">SYMPTOM</span>
                      </div>
                      <p className="font-body text-white/60 text-sm leading-relaxed pl-4 border-l border-red-400/20">
                        {prob.symptom}
                      </p>
                    </div>

                    {/* Cause */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-yellow-400" />
                        <span className="font-mono text-[10px] text-yellow-400/70 tracking-widest">ROOT CAUSE</span>
                      </div>
                      <div className="pl-4 border-l border-yellow-400/20">
                        <pre className="font-mono text-[11px] text-white/50 leading-relaxed whitespace-pre-wrap">
                          {prob.cause}
                        </pre>
                      </div>
                    </div>

                    {/* Solution code */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-[var(--neon-cyan)]" />
                        <span className="font-mono text-[10px] text-[var(--neon-cyan)]/70 tracking-widest">SOLUTION</span>
                      </div>
                      <div className="code-block">
                        {prob.solution.split('\n').map((line, li) => (
                          <div key={li} className="flex gap-3">
                            <span className="text-white/15 select-none w-4 text-right text-[10px] flex-shrink-0">{li + 1}</span>
                            <span
                              className={
                                line.trim().startsWith('//')
                                  ? 'text-green-400/60'
                                  : line.match(/\b(return|if|for|void|bool|float|int|auto|const|true|false|nullptr)\b/)
                                  ? 'text-[var(--neon-cyan)]'
                                  : line.match(/U[A-Z][a-zA-Z]+|F[A-Z][a-zA-Z]+|A[A-Z][a-zA-Z]+/)
                                  ? 'text-[var(--neon-orange)]'
                                  : 'text-white/75'
                              }
                            >
                              {line}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lesson */}
                    <div className="p-4 bg-[rgba(0,255,240,0.03)] border border-[rgba(0,255,240,0.15)]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[var(--neon-cyan)]">💡</span>
                        <span className="font-mono text-[10px] text-[var(--neon-cyan)]/70 tracking-widest">LESSON LEARNED</span>
                      </div>
                      <p className="font-body text-white/60 text-sm leading-relaxed">{prob.lesson}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}