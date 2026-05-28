import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ButterflyLogo from '../components/ButterflyLogo'
import { useCareerTest } from '../hooks/useCareerTest'
import { useAuth } from '../hooks/useAuth'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const VERSION_INFO = {
  1: {
    name: '직업흥미검사 H형',
    shortName: 'H형',
    badge: 'V1',
    icon: '🔍',
    color: 'var(--purple)',
    desc: '홀랜드 이론 기반 · 중학생 권장',
    detail: '6가지 직업 흥미 유형(RIASEC)을 측정하여\n나에게 맞는 직업군을 탐색합니다',
    questions: '총 54문항',
  },
  2: {
    name: '직업흥미검사 K형',
    shortName: 'K형',
    badge: 'V2',
    icon: '🎯',
    color: 'var(--teal)',
    desc: '쿠더 이론 기반 · 고등학생 권장',
    detail: '11가지 직업 흥미 영역을 분석하여\n구체적인 직업 적합도를 탐색합니다',
    questions: '총 45문항',
  },
}

const LIKERT = ['전혀\n아니다', '아니다', '보통이다', '그렇다', '매우\n그렇다']

const GRADES = [
  { value: '1', label: '1학년' },
  { value: '2', label: '2학년' },
  { value: '3', label: '3학년' },
]

const PER_PAGE = 6

export default function CareerTest() {
  const [step, setStep] = useState(0) // 0: 버전선택, 1: 기본정보, 2: 문항, 3: 완료
  const [version, setVersion] = useState(null)
  const [gender, setGender] = useState(null)
  const [grade, setGrade] = useState('2')
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resultUrl, setResultUrl] = useState('')
  const [startTime, setStartTime] = useState('')

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { saveResult } = useCareerTest(user)

  const isGuest = searchParams.get('guest') === 'true'
  const isNew = searchParams.get('new') === 'true'

  async function loadQuestions(v) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/career-test?action=questions&version=${v}`)
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || '질문을 불러오지 못했습니다')
      const qs = data.questions
      if (!Array.isArray(qs) || qs.length === 0) throw new Error('질문 데이터가 없습니다')
      setQuestions(qs)
      setAnswers(new Array(qs.length).fill(0))
      setStartTime(new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14))
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleVersionSelect(v) {
    setVersion(v)
    setStep(1)
  }

  function handleInfoNext() {
    if (!gender) { setError('성별을 선택해주세요'); return }
    setError('')
    loadQuestions(version)
  }

  function setAnswer(globalIdx, value) {
    setAnswers(prev => {
      const next = [...prev]
      next[globalIdx] = value
      return next
    })
  }

  async function handleSubmit() {
    const unanswered = answers.findIndex(a => a === 0)
    if (unanswered !== -1) {
      const jumpPage = Math.floor(unanswered / PER_PAGE)
      setPage(jumpPage)
      setError(`${unanswered + 1}번 문항에 아직 답하지 않았습니다`)
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/career-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version, gender, grade, answers, startDtm: startTime }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || '결과를 가져오지 못했습니다')

      const url = data.result?.url || data.result?.URL || ''
      setResultUrl(url)
      saveResult(version, {
        version,
        versionName: VERSION_INFO[version].name,
        url,
        gender,
        grade,
      })
      setStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(questions.length / PER_PAGE)
  const currentQs = questions.slice(page * PER_PAGE, (page + 1) * PER_PAGE)
  const answeredCount = answers.filter(a => a > 0).length
  const progress = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0
  const isPageDone = currentQs.every((_, i) => answers[page * PER_PAGE + i] > 0)

  const card = {
    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
    borderRadius: 20, padding: 28,
  }

  return (
    <div className="page" style={{ maxWidth: 720, margin: '0 auto', padding: '80px 20px 60px' }}>

      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: 36, animation: 'fadeUp 0.4s ease' }}>
        <ButterflyLogo size={48} animate />
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginTop: 12, marginBottom: 8 }}>
          진로 심리 검사
        </h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem' }}>
          {isNew ? '환영합니다! 나에게 맞는 직업 흥미를 알아보세요 🎉' : isGuest ? '비회원으로 검사를 시작합니다' : '직업 흥미 검사로 진로를 탐색하세요'}
        </p>
      </div>

      {/* 진행 표시 — 문항 단계에서만 */}
      {step === 2 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span>{answeredCount} / {questions.length} 문항 완료</span>
            <span>{progress}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--purple), var(--teal))',
              borderRadius: 99, transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      )}

      {/* ── STEP 0: 버전 선택 ── */}
      {step === 0 && (
        <div style={{ animation: 'fadeUp 0.4s ease' }}>
          <h2 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: 20, textAlign: 'center' }}>
            검사 유형을 선택하세요
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 28 }}>
            {[1, 2].map(v => {
              const info = VERSION_INFO[v]
              return (
                <button key={v} onClick={() => handleVersionSelect(v)} style={{
                  ...card,
                  textAlign: 'left', cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: `1px solid var(--card-border)`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = info.color; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = '' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <span style={{ fontSize: '2rem' }}>{info.icon}</span>
                    <span style={{
                      padding: '3px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700,
                      background: info.color, color: '#fff', fontFamily: "'Noto Sans KR', sans-serif",
                    }}>{info.badge}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: '1.05rem', marginBottom: 6 }}>
                    {info.name}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 10 }}>
                    {info.desc}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', fontFamily: "'Noto Sans KR', sans-serif", lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: 12 }}>
                    {info.detail}
                  </p>
                  <span style={{ fontSize: '0.78rem', color: info.color, fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600 }}>
                    {info.questions}
                  </span>
                </button>
              )
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={() => navigate(user ? '/my' : '/')} style={{
              color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.85rem',
              background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px',
            }}>
              {isNew || isGuest ? '지금은 건너뛰기 →' : '← 돌아가기'}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 1: 기본 정보 ── */}
      {step === 1 && (
        <div style={{ ...card, animation: 'fadeUp 0.4s ease' }}>
          <h2 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: '1.05rem', marginBottom: 24 }}>
            기본 정보를 입력해주세요
          </h2>

          {/* 성별 */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 10, fontWeight: 600 }}>
              성별 <span style={{ color: '#ef4444' }}>*</span>
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[['100323', '남성 👦'], ['100324', '여성 👧']].map(([val, label]) => (
                <button key={val} onClick={() => { setGender(val); setError('') }} style={{
                  flex: 1, padding: '14px', borderRadius: 14, cursor: 'pointer',
                  fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.95rem', fontWeight: 600,
                  border: `2px solid ${gender === val ? 'var(--purple)' : 'var(--card-border)'}`,
                  background: gender === val ? 'rgba(124,58,237,0.1)' : 'var(--bg-3)',
                  color: gender === val ? 'var(--purple-light)' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 학년 */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 10, fontWeight: 600 }}>
              학년
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {GRADES.map(g => (
                <button key={g.value} onClick={() => setGrade(g.value)} style={{
                  padding: '10px 20px', borderRadius: 99, cursor: 'pointer',
                  fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.88rem', fontWeight: 600,
                  border: `2px solid ${grade === g.value ? 'var(--teal)' : 'var(--card-border)'}`,
                  background: grade === g.value ? 'rgba(8,145,178,0.1)' : 'var(--bg-3)',
                  color: grade === g.value ? 'var(--teal)' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 10, marginBottom: 16,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#F87171', fontSize: '0.85rem', fontFamily: "'Noto Sans KR', sans-serif",
            }}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setStep(0); setError('') }} style={{
              flex: 1, padding: '12px', borderRadius: 12, cursor: 'pointer',
              fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem',
              background: 'var(--bg-3)', border: '1px solid var(--card-border)',
              color: 'var(--text-muted)',
            }}>
              ← 이전
            </button>
            <button onClick={handleInfoNext} disabled={loading} className="btn-primary" style={{ flex: 2 }}>
              {loading ? '문항 불러오는 중...' : '검사 시작하기 →'}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: 문항 ── */}
      {step === 2 && (
        <div style={{ animation: 'fadeUp 0.35s ease' }}>
          {/* 페이지 정보 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
              {VERSION_INFO[version]?.name}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
              {page + 1} / {totalPages} 페이지
            </span>
          </div>

          {/* 문항 카드들 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            {currentQs.map((q, i) => {
              const globalIdx = page * PER_PAGE + i
              const qText = q.question || q.qText || q.QUESTION || q.qtext || `문항 ${globalIdx + 1}`
              const qNum = q.qnum || q.no || q.QNUM || (globalIdx + 1)
              const selected = answers[globalIdx]

              return (
                <div key={globalIdx} style={{
                  ...card,
                  borderColor: selected > 0 ? 'rgba(124,58,237,0.3)' : 'var(--card-border)',
                  transition: 'border-color 0.2s',
                }}>
                  <p style={{
                    fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.95rem', lineHeight: 1.7,
                    color: 'var(--text-primary)', marginBottom: 16,
                  }}>
                    <span style={{ color: 'var(--purple-light)', fontWeight: 700, marginRight: 8 }}>
                      {qNum}.
                    </span>
                    {qText}
                  </p>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
                    {LIKERT.map((label, val) => (
                      <button key={val} onClick={() => setAnswer(globalIdx, val + 1)} style={{
                        flex: 1, padding: '10px 4px', borderRadius: 12, cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                        border: `2px solid ${selected === val + 1 ? 'var(--purple)' : 'var(--card-border)'}`,
                        background: selected === val + 1 ? 'rgba(124,58,237,0.12)' : 'var(--bg-3)',
                        transition: 'all 0.15s',
                      }}
                        onMouseEnter={e => selected !== val + 1 && (e.currentTarget.style.borderColor = 'var(--purple-light)')}
                        onMouseLeave={e => selected !== val + 1 && (e.currentTarget.style.borderColor = 'var(--card-border)')}
                      >
                        <span style={{ fontSize: '1.1rem' }}>
                          {['😞', '🙁', '😐', '😊', '😄'][val]}
                        </span>
                        <span style={{
                          fontSize: '0.7rem', color: selected === val + 1 ? 'var(--purple-light)' : 'var(--text-muted)',
                          fontFamily: "'Noto Sans KR', sans-serif", fontWeight: selected === val + 1 ? 700 : 400,
                          textAlign: 'center', lineHeight: 1.3, whiteSpace: 'pre-line',
                        }}>
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 10, marginBottom: 16,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#F87171', fontSize: '0.85rem', fontFamily: "'Noto Sans KR', sans-serif",
            }}>{error}</div>
          )}

          {/* 네비게이션 버튼 */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => { setPage(p => Math.max(0, p - 1)); setError('') }}
              disabled={page === 0}
              style={{
                flex: 1, padding: '13px', borderRadius: 12, cursor: page === 0 ? 'not-allowed' : 'pointer',
                fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem',
                background: 'var(--bg-3)', border: '1px solid var(--card-border)',
                color: page === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
                opacity: page === 0 ? 0.5 : 1,
              }}
            >
              ← 이전
            </button>

            {page < totalPages - 1 ? (
              <button
                onClick={() => {
                  if (!isPageDone) {
                    const firstUnanswered = currentQs.findIndex((_, i) => answers[page * PER_PAGE + i] === 0)
                    setError(`${page * PER_PAGE + firstUnanswered + 1}번 문항에 답해주세요`)
                    return
                  }
                  setError('')
                  setPage(p => p + 1)
                }}
                className="btn-primary"
                style={{ flex: 2 }}
              >
                다음 →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
                style={{ flex: 2 }}
              >
                {loading ? '결과 분석 중...' : '검사 완료 및 결과 보기 →'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 3: 결과 ── */}
      {step === 3 && (
        <div style={{ animation: 'fadeUp 0.4s ease' }}>
          <div style={{ ...card, textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', marginBottom: 10 }}>
              검사 완료!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem', marginBottom: 24, lineHeight: 1.7 }}>
              {VERSION_INFO[version]?.name} 검사가 완료되었습니다.<br />
              커리어넷에서 상세 결과를 확인하세요.
            </p>

            {resultUrl ? (
              <a
                href={resultUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px', borderRadius: 14,
                  background: 'linear-gradient(135deg, var(--purple), var(--teal))',
                  color: '#fff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700,
                  fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 16,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                📊 커리어넷에서 상세 결과 보기 →
              </a>
            ) : (
              <div style={{
                padding: '14px 20px', borderRadius: 12, marginBottom: 16,
                background: 'rgba(8,145,178,0.1)', border: '1px solid rgba(8,145,178,0.3)',
                color: 'var(--teal)', fontSize: '0.88rem', fontFamily: "'Noto Sans KR', sans-serif",
                lineHeight: 1.6,
              }}>
                결과가 저장되었습니다.<br />
                마이페이지에서 검사 기록을 확인할 수 있습니다.
              </div>
            )}

            <div style={{ marginTop: 8 }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
                결과가 마이페이지에 저장되었습니다
              </p>
            </div>
          </div>

          {/* 다른 버전도 해보기 */}
          <div style={{ ...card, marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: '0.95rem', marginBottom: 12 }}>
              다른 검사도 해볼까요?
            </h3>
            {[1, 2].filter(v => v !== version).map(v => {
              const info = VERSION_INFO[v]
              return (
                <button key={v} onClick={() => {
                  setVersion(v)
                  setStep(1)
                  setGender(null)
                  setGrade('2')
                  setQuestions([])
                  setAnswers([])
                  setPage(0)
                  setError('')
                  setResultUrl('')
                }} style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                  fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem',
                  background: 'var(--bg-3)', border: '1px solid var(--card-border)',
                  color: 'var(--text-secondary)', textAlign: 'left', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = info.color; e.currentTarget.style.color = info.color }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                >
                  <span>{info.icon}</span>
                  <div>
                    <span style={{ fontWeight: 700 }}>{info.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 8 }}>{info.desc}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* 하단 버튼 */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/')} style={{
              flex: 1, padding: '13px', borderRadius: 12, cursor: 'pointer',
              fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem',
              background: 'var(--bg-3)', border: '1px solid var(--card-border)',
              color: 'var(--text-secondary)',
            }}>
              홈으로
            </button>
            <button onClick={() => navigate('/my')} className="btn-primary" style={{ flex: 1 }}>
              마이페이지 →
            </button>
            <button onClick={() => navigate('/select')} className="btn-primary" style={{ flex: 2 }}>
              🦋 나비효과 분석하기
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
