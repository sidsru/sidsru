"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Play,
  Code2,
  Cpu,
  Zap,
  Target,
  ChevronDown,
  Github,
  Mail,
  Linkedin,
  ExternalLink,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  Layers,
  Gamepad2,
  Sword,
  Shield,
  Move,
  Sparkles,
} from "lucide-react";

// ============================================================
// 타입 정의
// ============================================================
interface NavItem {
  id: string;
  label: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SystemStep {
  name: string;
  description: string;
}

interface DeepDiveItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
  code: string;
}

interface OptimizationItem {
  problem: string;
  analysis: string;
  solution: string;
  before: string;
  after: string;
  improvement: string;
}

interface ProblemSolving {
  title: string;
  situation: string;
  cause: string;
  solution: string;
  result: string;
}

interface Skill {
  name: string;
  level: number;
  category: string;
}

// ============================================================
// 데이터
// ============================================================
const navItems: NavItem[] = [
  { id: "hero", label: "Home" },
  { id: "result", label: "Result" },
  { id: "architecture", label: "Architecture" },
  { id: "deepdive", label: "Deep Dive" },
  { id: "optimization", label: "Optimization" },
  { id: "problem-solving", label: "Problem Solving" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const features: Feature[] = [
  {
    icon: <Move className="w-6 h-6" />,
    title: "이동 시스템",
    description: "Motion Matching 기반 자연스러운 캐릭터 이동",
  },
  {
    icon: <Sword className="w-6 h-6" />,
    title: "전투 시스템",
    description: "GAS 기반 콤보 공격 및 스킬 시스템",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "피격 시스템",
    description: "방향별 피격 반응 및 히트스톱 구현",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "상태 시스템",
    description: "Gameplay Tag 기반 상태 관리",
  },
];

const systemSteps: SystemStep[] = [
  { name: "Input", description: "Enhanced Input System" },
  { name: "Character", description: "ACharacter + Custom Movement" },
  { name: "AbilitySystem", description: "GAS (Gameplay Ability System)" },
  { name: "Animation", description: "Motion Matching + ABP" },
  { name: "Rendering", description: "Niagara + Material" },
];

const deepDiveItems: DeepDiveItem[] = [
  {
    id: "animation",
    title: "애니메이션 시스템",
    icon: <Layers className="w-6 h-6" />,
    description: "Motion Matching을 활용한 자연스러운 캐릭터 애니메이션 구현",
    details: [
      "Pose Search를 통한 최적 애니메이션 매칭",
      "Trajectory 기반 미래 움직임 예측",
      "Database 구조 최적화로 검색 시간 단축",
      "Blend Space와의 하이브리드 사용",
    ],
    code: `// Motion Matching Pose Search 설정
UCLASS()
class UCustomPoseSearchSchema : public UPoseSearchSchema
{
    GENERATED_BODY()

public:
    virtual void BuildQuery(
        const FPoseSearchQueryContext& Context,
        FPoseSearchFeatureVectorBuilder& OutQuery) const override
    {
        // Trajectory 정보 추가
        AddTrajectoryFeatures(Context, OutQuery);
        
        // 현재 Pose 정보 추가  
        AddPoseFeatures(Context, OutQuery);
        
        // 속도 및 가속도 정보
        AddVelocityFeatures(Context, OutQuery);
    }
    
    void AddTrajectoryFeatures(
        const FPoseSearchQueryContext& Context,
        FPoseSearchFeatureVectorBuilder& OutQuery) const
    {
        // 미래 0.5초 후 위치 예측
        FVector PredictedLocation = PredictFutureLocation(
            Context.GetOwner(), 
            0.5f
        );
        OutQuery.AddVector(PredictedLocation);
    }
};`,
  },
  {
    id: "ability",
    title: "Ability System",
    icon: <Zap className="w-6 h-6" />,
    description: "Gameplay Ability System을 활용한 스킬 및 상태 관리",
    details: [
      "SetByCaller를 통한 동적 쿨타임 관리",
      "Gameplay Tag 기반 상태 제어",
      "Ability Task를 통한 비동기 처리",
      "GameplayEffect를 통한 데미지 계산",
    ],
    code: `// GAS 기반 스킬 쿨타임 설정
void UGA_BaseAttack::ApplyCooldown()
{
    if (!HasAuthority(&CurrentActorInfo))
        return;
        
    UGameplayEffect* CooldownGE = GetCooldownGameplayEffect();
    if (!CooldownGE)
        return;
    
    FGameplayEffectSpecHandle SpecHandle = 
        MakeOutgoingGameplayEffectSpec(
            CooldownGE->GetClass(),
            GetAbilityLevel()
        );
    
    // SetByCaller로 동적 쿨타임 설정
    float CooldownDuration = GetCooldownDuration();
    SpecHandle.Data->SetSetByCallerMagnitude(
        FGameplayTag::RequestGameplayTag("Data.Cooldown"),
        CooldownDuration
    );
    
    ApplyGameplayEffectSpecToOwner(
        CurrentSpecHandle,
        CurrentActorInfo,
        CurrentActivationInfo,
        SpecHandle
    );
}

// Tag 기반 상태 체크
bool UGA_BaseAttack::CanActivateAbility() const
{
    const FGameplayTagContainer* SourceTags = 
        GetAbilitySystemComponentFromActorInfo()
        ->GetOwnedGameplayTags();
    
    // 스턴 상태면 스킬 사용 불가
    if (SourceTags->HasTag(TAG_State_Stunned))
        return false;
        
    // 다른 스킬 사용 중이면 불가
    if (SourceTags->HasTag(TAG_State_Casting))
        return false;
        
    return Super::CanActivateAbility();
}`,
  },
  {
    id: "movement",
    title: "캐릭터 이동",
    icon: <Move className="w-6 h-6" />,
    description: "커스텀 Character Movement Component 구현",
    details: [
      "상태별 이동 속도 제어",
      "Root Motion과 일반 이동의 전환",
      "회전 보간 처리",
      "경사면/장애물 처리",
    ],
    code: `// 커스텀 Movement Component
void UCustomCharacterMovement::PhysCustom(
    float DeltaTime, 
    int32 Iterations)
{
    Super::PhysCustom(DeltaTime, Iterations);
    
    switch (CustomMovementMode)
    {
    case ECustomMovementMode::Climbing:
        PhysClimbing(DeltaTime, Iterations);
        break;
    case ECustomMovementMode::Dashing:
        PhysDashing(DeltaTime, Iterations);
        break;
    }
}

void UCustomCharacterMovement::UpdateRotation(float DeltaTime)
{
    if (bUseControllerDesiredRotation)
    {
        FRotator CurrentRotation = UpdatedComponent->
            GetComponentRotation();
        FRotator TargetRotation = GetControllerDesiredRotation();
        
        // 부드러운 회전 보간
        FRotator NewRotation = FMath::RInterpTo(
            CurrentRotation,
            TargetRotation,
            DeltaTime,
            RotationRate
        );
        
        MoveUpdatedComponent(
            FVector::ZeroVector,
            NewRotation,
            false
        );
    }
}

// 상태별 이동 속도 조절
float UCustomCharacterMovement::GetMaxSpeed() const
{
    if (IsCustomMovementMode(ECustomMovementMode::Climbing))
        return ClimbingSpeed;
        
    if (IsCrouching())
        return MaxWalkSpeedCrouched;
        
    // GAS에서 상태 태그 확인
    if (ASC && ASC->HasMatchingGameplayTag(TAG_State_Slowed))
        return MaxWalkSpeed * SlowedSpeedMultiplier;
        
    return Super::GetMaxSpeed();
}`,
  },
];

const optimizationItems: OptimizationItem[] = [
  {
    problem: "Draw Call 과다로 인한 프레임 드랍",
    analysis: "Stat GPU 확인 결과 Draw Call 3000+ 발생",
    solution: "Instanced Static Mesh, 머티리얼 병합, LOD 시스템 구축",
    before: "3,247 Draw Calls",
    after: "892 Draw Calls",
    improvement: "-72.5%",
  },
  {
    problem: "Tick 함수 과다 호출로 CPU 부하",
    analysis: "dumpticks 결과 불필요한 Tick 400+ 발견",
    solution: "Timer 기반 업데이트, 거리 기반 Tick 비활성화",
    before: "8.4ms (Tick Cost)",
    after: "2.1ms (Tick Cost)",
    improvement: "-75%",
  },
  {
    problem: "애니메이션 Pose Search 비용 증가",
    analysis: "Motion Matching DB 검색 시간 과다",
    solution: "KD-Tree 기반 검색, LOD별 DB 분리",
    before: "4.2ms per search",
    after: "0.8ms per search",
    improvement: "-81%",
  },
];

const problemSolvingItems: ProblemSolving[] = [
  {
    title: "스킬 쿨타임이 적용되지 않는 문제",
    situation:
      "GAS로 구현한 스킬의 쿨타임이 간헐적으로 무시되어 스킬이 연속 발동됨",
    cause:
      "Ability 활성화 시점과 GameplayEffect 적용 시점의 불일치. Prediction Key가 만료되어 서버-클라이언트 동기화 실패",
    solution:
      "CommitAbility() 호출 시점을 ActivateAbility() 초반으로 이동하고, WaitNetSync Task를 활용하여 쿨타임 적용을 보장",
    result:
      "쿨타임 누락 현상 100% 해결, 네트워크 환경에서도 안정적인 스킬 시스템 구축",
  },
  {
    title: "Motion Matching 전환 시 발이 미끄러지는 현상",
    situation:
      "걷기→뛰기 전환 시 캐릭터 발이 바닥에서 미끄러지며 부자연스러운 움직임 발생",
    cause:
      "Root Motion 속도와 실제 Movement 속도 불일치. Trajectory 예측값과 실제 이동 벡터의 차이",
    solution:
      "Distance Matching을 통한 발 위치 보정, Stride Warping으로 보폭 자동 조절 구현",
    result: "자연스러운 보행 전환 구현, 애니메이션 품질 대폭 향상",
  },
  {
    title: "100명 이상 캐릭터 렌더링 시 프레임 드랍",
    situation: "대규모 전투 씬에서 100+ 캐릭터 렌더링 시 15fps까지 하락",
    cause:
      "개별 캐릭터마다 풀 애니메이션 업데이트, LOD 미적용, Skeletal Mesh 과도한 본 수",
    solution:
      "Animation Budget Allocator 도입, 거리 기반 Update Rate 조절, Bone LOD 시스템 구현",
    result:
      "200명 캐릭터도 60fps 유지, Animation Thread 부하 80% 감소",
  },
];

const skills: Skill[] = [
  { name: "Unreal Engine 5", level: 90, category: "Engine" },
  { name: "C++", level: 85, category: "Language" },
  { name: "Gameplay Ability System", level: 88, category: "System" },
  { name: "Animation System", level: 85, category: "System" },
  { name: "Motion Matching", level: 80, category: "Animation" },
  { name: "Optimization / Profiling", level: 82, category: "Performance" },
  { name: "Blueprint", level: 90, category: "Engine" },
  { name: "Network Replication", level: 75, category: "Network" },
];

// ============================================================
// 컴포넌트들
// ============================================================

// 네비게이션 컴포넌트
const Navigation = ({
  activeSection,
  scrollToSection,
}: {
  activeSection: string;
  scrollToSection: (id: string) => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-darker/90 backdrop-blur-lg border-b border-primary/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <Gamepad2 className="w-8 h-8 text-primary" />
            <span className="font-bold text-lg gradient-text">
              UE Developer
            </span>
          </motion.div>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-primary/20 text-primary"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-darker/95 backdrop-blur-lg border-b border-primary/20"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeSection === item.id
                      ? "bg-primary/20 text-primary"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Hero 섹션
const HeroSection = ({ scrollToSection }: { scrollToSection: (id: string) => void }) => {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* 배경 효과 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse-slow" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 텍스트 영역 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">구직 중</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Unreal Engine</span>
              <br />
              <span className="gradient-text">Game Client Developer</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              캐릭터를 통해{" "}
              <span className="text-primary">시스템 설계</span>와{" "}
              <span className="text-secondary">엔진 이해도</span>를 증명합니다.
              <br />
              단순한 결과물이 아닌,{" "}
              <span className="text-accent">구현 과정과 최적화</span>까지.
            </p>

            {/* 핵심 키워드 */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                "Motion Matching",
                "Gameplay Ability System",
                "Optimization",
                "C++",
              ].map((keyword, index) => (
                <motion.span
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:border-primary/50 hover:bg-primary/10 transition-all cursor-default"
                >
                  {keyword}
                </motion.span>
              ))}
            </div>

            {/* CTA 버튼 */}
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("result")}
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                <Play className="w-5 h-5" />
                프로젝트 보기
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("contact")}
                className="px-8 py-4 bg-white/5 border border-white/20 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                연락하기
              </motion.button>
            </div>
          </motion.div>

          {/* 비디오 플레이스홀더 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="video-placeholder aspect-video">
              <div className="relative z-10 text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center cursor-pointer glow-border"
                >
                  <Play className="w-8 h-8 text-primary ml-1" />
                </motion.div>
                <p className="text-gray-400">캐릭터 데모 영상</p>
                <p className="text-sm text-gray-500 mt-1">10~20초 루프 영상</p>
              </div>
            </div>

            {/* 플로팅 태그 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm font-medium"
            >
              60 FPS 유지
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 px-4 py-2 bg-accent/20 border border-accent/50 rounded-lg text-accent text-sm font-medium"
            >
              Motion Matching
            </motion.div>
          </motion.div>
        </div>

        {/* 스크롤 인디케이터 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-500 cursor-pointer"
            onClick={() => scrollToSection("result")}
          >
            <span className="text-sm">Scroll Down</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Result 섹션
const ResultSection = () => {
  return (
    <section id="result" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Result</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            캐릭터 시스템 구현 결과물입니다.
            <br />
            영상과 함께 주요 기능을 확인하세요.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* 메인 비디오 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="sticky top-24"
          >
            <div className="video-placeholder aspect-video mb-4">
              <div className="relative z-10 text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <Play className="w-6 h-6 text-primary ml-1" />
                </motion.div>
                <p className="text-gray-400">전체 플레이 영상</p>
              </div>
            </div>
            <div className="flex gap-2">
              {["이동", "전투", "스킬", "피격"].map((label, index) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:border-primary/50 transition-all"
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* 기능 목록 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="stat-card group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}

            {/* 디버그 UI 프리뷰 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/30"
            >
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                Debug UI 포함
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-black/30 rounded-lg">
                  <span className="text-gray-500">Current State:</span>
                  <span className="ml-2 text-green-400">Locomotion</span>
                </div>
                <div className="p-3 bg-black/30 rounded-lg">
                  <span className="text-gray-500">Active Tags:</span>
                  <span className="ml-2 text-accent">3</span>
                </div>
                <div className="p-3 bg-black/30 rounded-lg">
                  <span className="text-gray-500">Skill CD:</span>
                  <span className="ml-2 text-yellow-400">2.3s</span>
                </div>
                <div className="p-3 bg-black/30 rounded-lg">
                  <span className="text-gray-500">Distance:</span>
                  <span className="ml-2 text-primary">15.2m</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Architecture 섹션
const ArchitectureSection = () => {
  return (
    <section id="architecture" className="py-32 relative bg-darker/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">System Architecture</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            전체 시스템 구조와 설계 의도입니다.
            <br />
            <span className="text-primary">"왜 이렇게 만들었는지"</span>가 핵심입니다.
          </p>
        </motion.div>

        {/* 시스템 플로우 다이어그램 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            {systemSteps.map((step, index) => (
              <div key={step.name} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="diagram-box min-w-[140px]"
                >
                  <div className="font-semibold text-primary mb-1">{step.name}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </motion.div>
                {index < systemSteps.length - 1 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.05 }}
                    className="diagram-arrow mx-2"
                  >
                    →
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* 설계 포인트 */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "왜 GAS를 사용했는가?",
              points: [
                "확장 가능한 스킬 시스템 필요",
                "네트워크 리플리케이션 내장",
                "Gameplay Tag 기반 상태 관리",
                "대규모 프로젝트 검증된 구조",
              ],
            },
            {
              title: "왜 Motion Matching인가?",
              points: [
                "State Machine 복잡도 감소",
                "자연스러운 애니메이션 전환",
                "새 모션 추가 용이성",
                "데이터 기반 애니메이션",
              ],
            },
            {
              title: "상태 관리 방식",
              points: [
                "Gameplay Tag 기반 상태 정의",
                "Tag Container로 복합 상태 표현",
                "Observer 패턴으로 상태 변화 감지",
                "GE를 통한 상태 자동 관리",
              ],
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="stat-card"
            >
              <h3 className="text-lg font-semibold mb-4 text-primary">{item.title}</h3>
              <ul className="space-y-3">
                {item.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Deep Dive 섹션
const DeepDiveSection = () => {
  const [activeTab, setActiveTab] = useState("animation");

  const activeItem = deepDiveItems.find((item) => item.id === activeTab);

  return (
    <section id="deepdive" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Deep Dive</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            핵심 시스템의 상세 구현입니다.
            <br />
            코드와 함께 구현 방식을 설명합니다.
          </p>
        </motion.div>

        {/* 탭 메뉴 */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {deepDiveItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(item.id)}
              className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                activeTab === item.id
                  ? "bg-primary text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {item.icon}
              {item.title}
            </motion.button>
          ))}
        </div>

        {/* 콘텐츠 */}
        <AnimatePresence mode="wait">
          {activeItem && (
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {/* 설명 */}
              <div>
                <h3 className="text-2xl font-bold mb-4">{activeItem.title}</h3>
                <p className="text-gray-400 mb-6">{activeItem.description}</p>
                <ul className="space-y-3 mb-8">
                  {activeItem.details.map((detail, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-gray-300">{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* 코드 */}
              <div className="code-block overflow-x-auto">
                <pre className="text-sm leading-relaxed">
                  <code>{activeItem.code}</code>
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// Optimization 섹션
const OptimizationSection = () => {
  return (
    <section id="optimization" className="py-32 relative bg-darker/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Optimization</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            최적화는 필수입니다.
            <br />
            <span className="text-primary">수치 없이는 의미 없습니다.</span>
          </p>
        </motion.div>

        <div className="space-y-8">
          {optimizationItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="stat-card"
            >
              <div className="grid lg:grid-cols-12 gap-6">
                {/* 문제 & 분석 */}
                <div className="lg:col-span-5">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-red-400 mb-1">Problem</h4>
                      <p className="text-gray-300">{item.problem}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 mb-4">
                    <Target className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-1">Analysis</h4>
                      <p className="text-gray-400 text-sm">{item.analysis}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-400 mb-1">Solution</h4>
                      <p className="text-gray-400 text-sm">{item.solution}</p>
                    </div>
                  </div>
                </div>

                {/* 결과 */}
                <div className="lg:col-span-7">
                  <div className="grid grid-cols-3 gap-4 h-full">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center flex flex-col justify-center">
                      <span className="text-xs text-gray-500 mb-1">BEFORE</span>
                      <span className="text-lg font-bold text-red-400">
                        {item.before}
                      </span>
                    </div>
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center flex flex-col justify-center">
                      <span className="text-xs text-gray-500 mb-1">AFTER</span>
                      <span className="text-lg font-bold text-green-400">
                        {item.after}
                      </span>
                    </div>
                    <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl text-center flex flex-col justify-center">
                      <TrendingUp className="w-6 h-6 text-primary mx-auto mb-1" />
                      <span className="text-xl font-bold text-primary">
                        {item.improvement}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 사용 도구 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <h4 className="text-sm text-gray-500 mb-4">분석 도구</h4>
          <div className="flex flex-wrap justify-center gap-3">
            {["Unreal Insights", "Stat Unit", "Stat GPU", "dumpticks", "CSV Profiling"].map(
              (tool) => (
                <span
                  key={tool}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400"
                >
                  {tool}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Problem Solving 섹션
const ProblemSolvingSection = () => {
  return (
    <section id="problem-solving" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Problem Solving</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            실제 겪은 문제와 해결 과정입니다.
            <br />
            <span className="text-primary">이게 진짜 실무 능력입니다.</span>
          </p>
        </motion.div>

        <div className="space-y-8">
          {problemSolvingItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="stat-card"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </span>
                {item.title}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="timeline-item pb-4">
                    <h4 className="text-sm font-semibold text-yellow-400 mb-1">
                      상황 (Situation)
                    </h4>
                    <p className="text-gray-400 text-sm">{item.situation}</p>
                  </div>
                  <div className="timeline-item pb-4">
                    <h4 className="text-sm font-semibold text-red-400 mb-1">
                      원인 (Cause)
                    </h4>
                    <p className="text-gray-400 text-sm">{item.cause}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="timeline-item pb-4">
                    <h4 className="text-sm font-semibold text-blue-400 mb-1">
                      해결 (Solution)
                    </h4>
                    <p className="text-gray-400 text-sm">{item.solution}</p>
                  </div>
                  <div className="timeline-item">
                    <h4 className="text-sm font-semibold text-green-400 mb-1">
                      결과 (Result)
                    </h4>
                    <p className="text-gray-400 text-sm">{item.result}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Skills 섹션
const SkillsSection = () => {
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="skills" className="py-32 relative bg-darker/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Technical Skills</span>
          </h2>
          <p className="text-gray-400 text-lg">기술 스택 및 숙련도</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-white/5 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{skill.name}</span>
                <span className="text-sm text-primary">{skill.level}%</span>
              </div>
              <div className="progress-bar">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.05 }}
                  className="progress-fill"
                />
              </div>
              <span className="text-xs text-gray-500 mt-1 block">{skill.category}</span>
            </motion.div>
          ))}
        </div>

        {/* 키워드 태그 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h4 className="text-sm text-gray-500 mb-4">Keywords</h4>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Unreal Engine",
              "C++",
              "Gameplay Ability System",
              "Animation System",
              "Optimization",
              "Profiling",
              "Motion Matching",
              "Network Replication",
              "Blueprint",
            ].map((keyword) => (
              <span
                key={keyword}
                className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg text-sm text-primary font-medium hover:bg-primary/20 transition-all"
              >
                {keyword}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Contact 섹션
const ContactSection = () => {
  return (
    <section id="contact" className="py-32 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Contact</span>
          </h2>
          <p className="text-gray-400 text-lg mb-12">
            함께 일하고 싶으시다면 연락주세요.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <motion.a
              href="mailto:your.email@example.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 bg-primary/20 border border-primary/50 rounded-xl text-primary hover:bg-primary hover:text-white transition-all"
            >
              <Mail className="w-5 h-5" />
              your.email@example.com
            </motion.a>
            <motion.a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-all"
            >
              <Github className="w-5 h-5" />
              GitHub
              <ExternalLink className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-all"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          </div>

          <div className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/30">
            <h3 className="text-xl font-semibold mb-4">다른 지원자들과의 차이</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="p-4 bg-black/20 rounded-xl">
                <h4 className="text-red-400 font-medium mb-2">❌ 다른 사람들</h4>
                <p className="text-gray-400 text-sm">
                  "캐릭터 만들었습니다"
                </p>
              </div>
              <div className="p-4 bg-black/20 rounded-xl">
                <h4 className="text-green-400 font-medium mb-2">✓ 저는</h4>
                <p className="text-gray-400 text-sm">
                  "이 구조로 만들었고, 이 문제를 이렇게 해결했고, 성능을 이렇게 개선했습니다"
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500 text-sm">
          © 2024 Unreal Engine Game Developer Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

// ============================================================
// 메인 페이지 컴포넌트
// ============================================================
export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 스크롤 위치에 따른 활성 섹션 감지
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen">
      <Navigation
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />
      <HeroSection scrollToSection={scrollToSection} />
      <div className="section-divider" />
      <ResultSection />
      <div className="section-divider" />
      <ArchitectureSection />
      <div className="section-divider" />
      <DeepDiveSection />
      <div className="section-divider" />
      <OptimizationSection />
      <div className="section-divider" />
      <ProblemSolvingSection />
      <div className="section-divider" />
      <SkillsSection />
      <div className="section-divider" />
      <ContactSection />
      <Footer />
    </main>
  );
}