import { useState } from 'react'
import ButterflyLogo from './ButterflyLogo'

export const TUTORIAL_KEY = 'butterfly_tutorial_seen'

const steps = [
  {
    logo: true,
    title: 'BUTTERFLY에 오신 것을\n환영합니다!',
    desc: '학교에서의 작은 선택이 어떤 나비효과를 만드는지\nClaude AI와 함께 탐색해보세요.',
    tag: null,
  },
  {
    emoji: '✍️',
    title: '5가지 선택 입력하기',
    desc: '학습·동아리·공간·방과후·친구관계\n5개 영역에서 나의 선택을 자유롭게 적어보세요.',
    tag: '선택 분석 페이지에서 시작',
  },
  {
    emoji: '🤖',
    title: 'AI가 나비효과를 분석해요',
    desc: '입력한 선택을 바탕으로 단기·중기·장기\n3단계 파급효과 리포트를 생성합니다.',
    tag: '실제 공공 교육 데이터 기반',
  },
  {
    emoji: '🧠',
    title: '진로 심리 검사 (RIASEC)',
    desc: 'Holland 직업 흥미 유형 검사로\n나에게 맞는 진로를 추천받으세요.',
    tag: '비회원도 무료 이용 가능',
  },
  {
    emoji: '🗺️',
    title: '지역 교육 격차 지도',
    desc: '전국 17개 시도의 교육 기회 차이를\n인터랙티브 지도로 한눈에 확인하세요.',
    tag: '진학률 · 학교 수 · 지역 비교',
  },
  {
    emoji: '🚀',
    title: '지금 시작해볼까요?',
    desc: '회원가입하면 분석 결과를 저장하고\n나중에 다시 불러올 수 있어요.',
    tag: null,
    isLast: true,
  },
]

export default function Tutorial({ onClose }) {
  const [step, setStep] = useState(0)
  const current = steps[step]

  const dismiss = () => {
    localStorage.setItem(TUTORIAL_KEY, 'true')
    onClose()
  }

  const handleNext = () => {
    if (step < steps.length - 1) setStep(s => s + 1)
    else dismiss()
  }

  const handlePrev = () => {
    if (step > 0) setStep(s => s - 1)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(7, 5, 20, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) dismiss() }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) }
          to   { opacity: 1; transform: translateY(0) }
        }
      `}</style>

      <div style={{
        width: '100%', maxWidth: 460,
        background: 'var(--bg-2)',
        border: '1px solid rgba(124,58,237,0.35)',
        borderRadius: 24,
        padding: '36px 32px 28px',
        position: 'relative',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1)',
        animation: 'slideUp 0.35s ease',
      }}>

        {/* Skip */}
        <button
          onClick={dismiss}
          style={{
            position: 'absolute', top: 16, right: 16,
            padding: '5px 13px', borderRadius: 50,
            background: 'var(--bg-3)',
            border: '1px solid var(--card-border)',
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            fontFamily: "'Noto Sans KR', sans-serif",
            cursor: 'pointer',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--purple)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--card-border)' }}
        >
          건너뛰기
        </button>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 32 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              height: 6,
              width: i === step ? 28 : 6,
              borderRadius: 3,
              background: i === step
                ? 'linear-gradient(90deg, var(--purple), var(--teal))'
                : i < step ? 'rgba(124,58,237,0.45)' : 'var(--card-border)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }} onClick={() => setStep(i)} />
          ))}
        </div>

        {/* Step content */}
        <div key={step} style={{ textAlign: 'center', animation: 'slideUp 0.3s ease' }}>
          {/* Icon */}
          <div style={{ marginBottom: 20, lineHeight: 1 }}>
            {current.logo
              ? <ButterflyLogo size={64} animate />
              : <span style={{ fontSize: '3.4rem' }}>{current.emoji}</span>
            }
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(1.3rem, 5vw, 1.6rem)',
            lineHeight: 1.25,
            marginBottom: 14,
            whiteSpace: 'pre-line',
          }}>
            {current.title}
          </h2>

          {/* Desc */}
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.88rem',
            lineHeight: 1.75,
            fontFamily: "'Noto Sans KR', sans-serif",
            marginBottom: current.tag ? 20 : 4,
            whiteSpace: 'pre-line',
          }}>
            {current.desc}
          </p>

          {/* Highlight tag */}
          {current.tag && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '5px 14px', borderRadius: 99,
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.3)',
              color: 'var(--purple-light)',
              fontSize: '0.76rem',
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 700,
            }}>
              ✨ {current.tag}
            </span>
          )}
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 32, gap: 10,
        }}>
          <button
            onClick={handlePrev}
            disabled={step === 0}
            style={{
              padding: '10px 20px', borderRadius: 50,
              background: 'var(--bg-3)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              fontFamily: "'Noto Sans KR', sans-serif",
              opacity: step === 0 ? 0.3 : 1,
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
              minWidth: 76,
            }}
          >
            ← 이전
          </button>

          <span style={{
            color: 'var(--text-muted)',
            fontSize: '0.76rem',
            fontFamily: "'Noto Sans KR', sans-serif",
            flexShrink: 0,
          }}>
            {step + 1} / {steps.length}
          </span>

          <button
            onClick={handleNext}
            className="btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.9rem', minWidth: 88 }}
          >
            {current.isLast ? '시작하기 🚀' : '다음 →'}
          </button>
        </div>
      </div>
    </div>
  )
}
