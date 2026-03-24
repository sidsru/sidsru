'use client'

import { useEffect, useRef, useState } from 'react'

const tabs = [
  { id: 'animation', label: 'ANIMATION SYS', icon: '🎭' },
  { id: 'ability', label: 'ABILITY SYS', icon: '⚡' },
  { id: 'movement', label: 'MOVEMENT SYS', icon: '🎮' },
]

const content = {
  animation: {
    title: 'Motion Matching System',
    summary: 'State Machine의 복잡도 문제를 해결하기 위해 Motion Matching 방식을 선택. Pose Database에서 비용 함수를 통해 최적 Pose를 검색합니다.',
    steps: [
      {
        title: 'Pose Search Schema 정의',
        desc: 'Bone Channel (Root, Hips, Foot_L/R)과 Trajectory Channel을 설정. 채널 가중치(PoseWeight, TrajectoryWeight)를 튜닝해 반응성과 자연스러움의 균형을 조절.',
      },
      {
        title: 'Pose Database 구성',
        desc: '애니메이션 에셋을 Pose Database에 등록. 런타임에 UPoseSearchLibrary::UpdateMotionMatchingState가 매 프레임 현재 Trajectory와 가장 가까운 Pose를 검색.',
      },
      {
        title: '전환 비용 최소화',
        desc: 'ContinuingPoseCostBias로 현재 재생 중인 Pose에 유리하게 설정해 불필요한 전환을 줄임. Blending Time 조절로 팝핑 현상 방지.',
      },
    ],
    code: `// AnimInstance에서 Motion Matching 업데이트
void UMyAnimInstance::NativeUpdateAnimation(float DeltaSeconds)
{
    Super::NativeUpdateAnimation(DeltaSeconds);

    AMyCharacter* Owner = Cast<AMyCharacter>(GetOwningActor());
    if (!Owner) return;

    // Trajectory 업데이트
    UPoseSearchLibrary::UpdateMotionMatchingState(
        this,               // AnimInstance
        SearchSet,          // Pose Search Set
        BlendParameters,    // 블렌딩 파라미터
        MMDatabaseTags,     // 사용할 DB 태그
        Trajectory,         // 현재 Trajectory
        MotionMatchingState // 결과 상태
    );

    // 루트 모션 속도 동기화
    DesiredSpeed = Owner->GetVelocity().Size2D();
    bIsMoving    = DesiredSpeed > MinMoveSpeed;
}`,
    metrics: [
      { label: 'Blend States 감소', before: '47개', after: '12개', good: true },
      { label: '애니메이션 추가 비용', before: 'O(N²)', after: 'O(1)', good: true },
      { label: '전환 자연스러움', before: '70점', after: '94점', good: true },
    ],
  },
  ability: {
    title: 'Gameplay Ability System',
    summary: 'GAS를 사용해 스킬, 쿨타임, 버프/디버프, 상태 제어를 하나의 시스템으로 통합. Tag 기반 선언적 상태 관리로 조건 분기 복잡도를 낮춥니다.',
    steps: [
      {
        title: 'AttributeSet 설계',
        desc: 'Health, Stamina, AttackPower, Defense를 UAttributeSet으로 중앙화. GAMEPLAYATTRIBUTE_REPNOTIFY 매크로로 네트워크 복제 자동화. PreAttributeChange에서 값 클램핑 처리.',
      },
      {
        title: 'SetByCaller 쿨타임 구조',
        desc: 'GameplayEffect에 Duration을 SetByCaller로 설정해 런타임에 쿨타임 수치를 동적 변경. AttributeSet의 쿨타임 감소 스탯과 연동.',
      },
      {
        title: 'Tag 기반 상태 제어',
        desc: 'State.Combat.Attacking, State.CC.Stun, State.Dead 등 계층형 Tag로 상태 표현. AbilitySystemComponent의 OnGameplayTagCountChanged 델리게이트로 UI와 애니메이션 연동.',
      },
    ],
    code: `// Ability 활성화 조건 체크 + 실행
bool UMyGameplayAbility::CanActivateAbility(
    const FGameplayAbilitySpecHandle Handle,
    const FGameplayAbilityActorInfo* ActorInfo,
    const FGameplayTagContainer* SourceTags,
    const FGameplayTagContainer* TargetTags,
    FGameplayTagContainer* OptionalRelevantTags) const
{
    if (!Super::CanActivateAbility(...)) return false;

    // 블로킹 태그 확인
    UAbilitySystemComponent* ASC = ActorInfo->AbilitySystemComponent.Get();
    if (ASC->HasAnyMatchingGameplayTags(ActivationBlockedTags))
        return false;

    // 스태미나 확인 (SetByCaller 값)
    float StaminaCost = GetCostGameplayEffect()
        ->Modifiers[0].ModifierMagnitude
        .GetSetByCallerFloat(TAG_Data_StaminaCost);
    float CurStamina = ASC->GetNumericAttribute(
        UMyAttrSet::GetStaminaAttribute());

    return CurStamina >= StaminaCost;
}

// 쿨타임 적용
void UMyGameplayAbility::ApplyCooldown(
    const FGameplayAbilitySpecHandle Handle,
    const FGameplayAbilityActorInfo* ActorInfo,
    const FGameplayAbilityActivationInfo ActivationInfo) const
{
    UGameplayEffect* CooldownGE = GetCooldownGameplayEffect();
    if (CooldownGE)
    {
        FGameplayEffectSpecHandle Spec =
            MakeOutgoingGameplayEffectSpec(CooldownGE->GetClass(), GetAbilityLevel());
        // 런타임 쿨타임 설정
        Spec.Data->SetSetByCallerMagnitude(
            TAG_Data_CooldownDuration, CooldownDuration);
        ApplyGameplayEffectSpecToOwner(Handle, ActorInfo, ActivationInfo, Spec);
    }
}`,
    metrics: [
      { label: '조건 분기 코드 감소', before: '320줄', after: '85줄', good: true },
      { label: '쿨타임 동적 변경', before: '불가', after: '런타임 적용', good: true },
      { label: '버그 발생률', before: '높음', after: '구조적 방지', good: true },
    ],
  },
  movement: {
    title: 'Custom Movement System',
    summary: 'UCharacterMovementComponent를 확장해 게임에 맞는 이동 시스템 구현. 상태별 이동 속도, 회전 처리, 지형 적응을 커스텀합니다.',
    steps: [
      {
        title: '커스텀 이동 모드',
        desc: 'ECustomMovementMode를 정의해 Sprinting, Crouching, WallSlide 모드 추가. PhysCustom override에서 각 모드별 물리 처리. Prediction 호환을 위해 MoveAlongFloor 기반 유지.',
      },
      {
        title: '회전 처리',
        desc: '컨트롤러 입력 방향과 캐릭터 회전을 분리. bOrientRotationToMovement 비활성화 후 FMath::RInterpTo로 직접 회전 보간. 전투 중에는 Target Lock 방향으로 즉시 전환.',
      },
      {
        title: '이동 가속도 커브',
        desc: 'UCurveFloat을 사용해 가속/감속 곡선을 데이터 기반으로 조절. 디자이너가 코드 없이 느낌을 튜닝할 수 있도록 노출. 상태별로 다른 커브 에셋 사용.',
      },
    ],
    code: `// 커스텀 Sprint 이동 처리
void UMyCharacterMovementComponent::PhysCustom(
    float DeltaTime, int32 Iterations)
{
    switch (CustomMovementMode)
    {
    case CMOVE_Sprint:
        PhysSprint(DeltaTime, Iterations);
        break;
    case CMOVE_WallSlide:
        PhysWallSlide(DeltaTime, Iterations);
        break;
    default:
        Super::PhysCustom(DeltaTime, Iterations);
    }
}

// 회전 처리 - 전투/탐색 모드 분기
void AMyCharacter::RotateToTarget(float DeltaTime)
{
    FRotator TargetRot = bIsInCombat
        ? GetRotationToLockTarget()  // Target Lock 방향
        : GetRotationToMovement();   // 이동 방향

    // 부드러운 보간 회전
    SetActorRotation(FMath::RInterpTo(
        GetActorRotation(),
        TargetRot,
        DeltaTime,
        bIsInCombat ? CombatRotSpeed : ExploreRotSpeed
    ));
}`,
    metrics: [
      { label: '회전 부자연스러움', before: '즉각 전환', after: '부드러운 보간', good: true },
      { label: '이동 모드 확장성', before: '하드코딩', after: '데이터 기반', good: true },
      { label: 'CMC Prediction', before: '깨짐', after: '정상 작동', good: true },
    ],
  },
}

export default function DeepDive() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'animation' | 'ability' | 'movement'>('animation')

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const cur = content[activeTab]

  return (
    <section id="deepdive" className="relative py-32 bg-[#050508]" ref={sectionRef}>
      <div className="glow-line w-full" />
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className={`mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="sys-tag border-[rgba(241,90,36,0.5)] text-[var(--neon-orange)] bg-[rgba(241,90,36,0.05)]">
              03 / DEEP DIVE
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--neon-orange)] to-transparent opacity-30" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            DEEP <span className="text-[var(--neon-cyan)]">DIVE</span>
          </h2>
          <p className="font-body text-white/50 max-w-2xl text-lg">
            핵심 시스템 3개를 깊게 파고듭니다. 구현 과정, 설계 이유, 실제 코드까지.
          </p>
        </div>

        {/* Tab selector */}
        <div className={`flex gap-2 mb-10 flex-wrap transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-3 font-mono text-[11px] tracking-widest transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[var(--neon-cyan)] text-black'
                  : 'border border-[rgba(0,255,240,0.3)] text-white/50 hover:text-white/80 hover:border-[rgba(0,255,240,0.6)]'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Summary */}
          <div className="neon-border bg-[var(--dark-card)] p-6 mb-8">
            <h3 className="font-display text-xl font-bold text-[var(--neon-cyan)] mb-3">{cur.title}</h3>
            <p className="font-body text-white/60 text-base leading-relaxed">{cur.summary}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Implementation steps */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-[1px] w-6 bg-[var(--neon-orange)]" />
                <span className="font-mono text-xs text-white/40 tracking-widest">IMPLEMENTATION STEPS</span>
              </div>
              <div className="space-y-4">
                {cur.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-7 h-7 border border-[rgba(0,255,240,0.4)] flex items-center justify-center">
                        <span className="font-mono text-[10px] text-[var(--neon-cyan)]">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-display text-sm font-bold text-white mb-1">{step.title}</div>
                      <p className="font-body text-white/50 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Result metrics */}
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[1px] w-6 bg-[var(--neon-cyan)]" />
                  <span className="font-mono text-xs text-white/40 tracking-widest">RESULT METRICS</span>
                </div>
                <div className="space-y-3">
                  {cur.metrics.map((m) => (
                    <div key={m.label} className="flex items-center gap-3 p-3 border border-[rgba(0,255,240,0.1)] bg-black/30">
                      <span className="font-mono text-[10px] text-white/50 flex-1">{m.label}</span>
                      <span className="font-mono text-[10px] text-red-400/70 line-through">{m.before}</span>
                      <div className="w-4 h-[1px] bg-white/20" />
                      <span className="font-mono text-[10px] text-[var(--neon-cyan)] font-bold">{m.after}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Code */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-[1px] w-6 bg-[var(--neon-cyan)]" />
                <span className="font-mono text-xs text-white/40 tracking-widest">ACTUAL CODE</span>
              </div>

              <div className="neon-border bg-black/70 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-[rgba(0,255,240,0.15)] bg-[rgba(0,255,240,0.03)]">
                  <div className="w-2 h-2 bg-[var(--neon-cyan)]" />
                  <span className="font-mono text-[10px] text-white/40">
                    {activeTab === 'animation' ? 'MyAnimInstance.cpp' : activeTab === 'ability' ? 'MyGameplayAbility.cpp' : 'MyCharacterMovement.cpp'}
                  </span>
                </div>
                <div className="code-block text-[11px] overflow-auto max-h-[480px]">
                  {cur.code.split('\n').map((line, i) => (
                    <div key={i} className="flex gap-3 hover:bg-white/[0.02] transition-colors">
                      <span className="text-white/15 select-none w-5 text-right flex-shrink-0 text-[10px]">{i + 1}</span>
                      <span
                        className={
                          line.trim().startsWith('//')
                            ? 'text-green-400/60'
                            : line.match(/\b(return|if|for|while|switch|case|break|void|bool|float|int|auto|const|true|false)\b/)
                            ? 'text-[var(--neon-cyan)]'
                            : line.match(/U[A-Z][a-zA-Z]+|F[A-Z][a-zA-Z]+|E[A-Z][a-zA-Z]+/)
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
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}