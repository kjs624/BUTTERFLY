import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ButterflyLogo from '../components/ButterflyLogo'
import { useCareerTest } from '../hooks/useCareerTest'
import { useAuth } from '../hooks/useAuth'
import CareerResultViewer from '../components/CareerResultViewer'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

// RIASEC 유형 설명 (H형)
const RIASEC = {
  R: { name: '현실형', emoji: '🔧', desc: '도구·기계·자연을 좋아함' },
  I: { name: '탐구형', emoji: '🔬', desc: '분석·연구·학문을 좋아함' },
  A: { name: '예술형', emoji: '🎨', desc: '창작·표현·감성을 좋아함' },
  S: { name: '사회형', emoji: '🤝', desc: '사람 돕기·교육·봉사를 좋아함' },
  E: { name: '진취형', emoji: '💼', desc: '리더십·설득·사업을 좋아함' },
  C: { name: '관습형', emoji: '📋', desc: '정리·규칙·데이터를 좋아함' },
}

function ResultSummaryCard({ result, version }) {
  const card = {
    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
    borderRadius: 20, padding: 24, marginBottom: 20,
  }

  // H형: wonScore 기반 RIASEC 차트
  const wonScore = result.wonScore
  const jobList = result.jobList || result.jobs || []
  const hasScores = wonScore && Object.keys(wonScore).length > 0

  // 점수 배열 정렬
  const sortedScores = hasScores
    ? Object.entries(wonScore)
        .map(([k, v]) => ({ key: k.toUpperCase(), val: Number(v) }))
        .sort((a, b) => b.val - a.val)
    : []

  const maxScore = sortedScores.length > 0 ? sortedScores[0].val : 1

  if (!hasScores && jobList.length === 0) return null

  return (
    <div style={{ ...card, animation: 'fadeUp 0.4s ease' }}>
      <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: 20 }}>
        📊 내 흥미 유형 결과
      </h3>

      {hasScores && (
        <div style={{ marginBottom: 20 }}>
          {sortedScores.map(({ key, val }, i) => {
            const info = RIASEC[key] || { name: key, emoji: '📌', desc: '' }
            const pct = Math.round((val / maxScore) * 100)
            return (
              <div key={key} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.88rem', fontWeight: i < 2 ? 700 : 400, color: i < 2 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {info.emoji} {key}형 ({info.name})
                    {i === 0 && <span style={{ marginLeft: 6, fontSize: '0.72rem', padding: '2px 7px', borderRadius: 99, background: 'var(--purple)', color: '#fff' }}>1위</span>}
                    {i === 1 && <span style={{ marginLeft: 6, fontSize: '0.72rem', padding: '2px 7px', borderRadius: 99, background: 'var(--teal)', color: '#fff' }}>2위</span>}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>{val}점</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg-3)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: i === 0 ? 'linear-gradient(90deg,var(--purple),var(--teal))' : i === 1 ? 'var(--teal)' : 'var(--bg-2)',
                    borderRadius: 99, transition: 'width 0.6s ease',
                  }} />
                </div>
                {i < 2 && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", marginTop: 3 }}>
                    {info.desc}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {jobList.length > 0 && (
        <div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 10, fontWeight: 600 }}>
            🎯 추천 직업
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {jobList.slice(0, 10).map((j, i) => {
              const name = j.job || j.jobNm || j.name || (typeof j === 'string' ? j : '')
              if (!name) return null
              return (
                <span key={i} style={{
                  padding: '5px 12px', borderRadius: 99, fontSize: '0.8rem',
                  background: 'var(--bg-3)', color: 'var(--text-secondary)',
                  fontFamily: "'Noto Sans KR', sans-serif", border: '1px solid var(--card-border)',
                }}>
                  {name}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const VERSION_INFO = {
  1: {
    name: '직업가치관검사',
    shortName: '가치관',
    badge: 'V1',
    icon: '💎',
    color: 'var(--purple)',
    desc: '직업 가치관 탐색 · 고등학생 권장',
    detail: '28가지 직업 가치를 비교하여\n나에게 중요한 직업 가치관을 발견합니다',
    questions: '총 28문항 · 약 5분',
  },
  2: {
    name: '직업흥미검사 K형',
    shortName: 'K형',
    badge: 'V2',
    icon: '🎯',
    color: 'var(--teal)',
    desc: '직업 흥미 탐색 · 고등학생 권장',
    detail: '11가지 직업 흥미 영역을 분석하여\n구체적인 직업 적합도를 탐색합니다',
    questions: '총 64문항 · 약 15분',
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
  const [resultData, setResultData] = useState(null)
  const [showViewer, setShowViewer] = useState(false)
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
      // 주관식(텍스트) 문항은 빈 문자열, 나머지는 null로 초기화
      setAnswers(qs.map(q => q.answerScore01 == null ? '' : null))
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

  function isUnanswered(a) {
    return a === null || a === ''
  }

  async function handleSubmit() {
    const unanswered = answers.findIndex(a => isUnanswered(a))
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

      const rawResult = data.result || {}

      // 백엔드가 직접 url 필드로 반환, 없으면 result 내부 탐색
      const url = data.url || rawResult?.url || rawResult?.URL || ''
      console.log('[CareerTest] 결과 URL:', url)
      setResultUrl(url)
      setResultData(rawResult)

      // 커리어넷 응답에서 의미있는 결과 추출 (RESULT 중첩 포함)
      const inner = rawResult.RESULT || rawResult.result || rawResult
      const topTypes = []
      const recommendedJobs = []
      let resultSummary = ''

      if (inner.wonScore) {
        const scores = Object.entries(inner.wonScore)
          .map(([k, v]) => ({ key: k, val: Number(v) }))
          .sort((a, b) => b.val - a.val)
        scores.slice(0, 2).forEach(s => topTypes.push(s.key))
        resultSummary = `상위 흥미 유형: ${topTypes.join(', ')}`
      }
      const jobsArr = inner.jobList || inner.jobs || rawResult.jobList || rawResult.jobs || []
      jobsArr.slice(0, 8).forEach(j => {
        const name = j.job || j.jobNm || j.name || (typeof j === 'string' ? j : '')
        if (name) recommendedJobs.push(name)
      })
      if (inner.summary || inner.resultSummary) {
        resultSummary = inner.summary || inner.resultSummary
      }

      saveResult(version, {
        version,
        versionName: VERSION_INFO[version].name,
        url,
        gender,
        grade,
        rawResult,
        topTypes,
        recommendedJobs,
        resultSummary,
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
  const answeredCount = answers.filter(a => !isUnanswered(a)).length
  const progress = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0
  const isPageDone = currentQs.every((_, i) => !isUnanswered(answers[page * PER_PAGE + i]))

  const card = {
    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
    borderRadius: 20, padding: 28,
  }

  return (
    <>
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
              const qNum = q.qitemNo || q.qnum || q.no || (globalIdx + 1)
              const selected = answers[globalIdx]

              // H형(version=1): 2지선다 — answer01 vs answer02
              if (version === 1) {
                const choiceA = q.answer01 || ''
                const choiceB = q.answer02 || ''
                const descA = q.answer03 || ''
                const descB = q.answer04 || ''
                return (
                  <div key={globalIdx} style={{
                    ...card,
                    borderColor: selected !== null ? 'rgba(124,58,237,0.3)' : 'var(--card-border)',
                    transition: 'border-color 0.2s',
                  }}>
                    <p style={{
                      fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.82rem',
                      color: 'var(--text-muted)', marginBottom: 14,
                    }}>
                      <span style={{ color: 'var(--purple-light)', fontWeight: 700, marginRight: 6 }}>{qNum}.</span>
                      두 가치 중 나에게 더 중요한 것을 선택하세요
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[
                        { label: choiceA, desc: descA, scoreVal: parseInt(q.answerScore01) },
                        { label: choiceB, desc: descB, scoreVal: parseInt(q.answerScore02) },
                      ].map(choice => (
                        <button key={choice.scoreVal} onClick={() => setAnswer(globalIdx, choice.scoreVal)} style={{
                          padding: '16px 12px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                          fontFamily: "'Noto Sans KR', sans-serif",
                          border: `2px solid ${selected === choice.scoreVal ? 'var(--purple)' : 'var(--card-border)'}`,
                          background: selected === choice.scoreVal ? 'rgba(124,58,237,0.12)' : 'var(--bg-3)',
                          transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => selected !== choice.scoreVal && (e.currentTarget.style.borderColor = 'var(--purple-light)')}
                          onMouseLeave={e => selected !== choice.scoreVal && (e.currentTarget.style.borderColor = 'var(--card-border)')}
                        >
                          <div style={{
                            fontSize: '1rem', fontWeight: 700, marginBottom: 6,
                            color: selected === choice.scoreVal ? 'var(--purple-light)' : 'var(--text-primary)',
                          }}>
                            {choice.label}
                          </div>
                          {choice.desc && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                              {choice.desc}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              }

              // K형(version=2): 문항 유형 자동 감지
              const qText = q.question || `문항 ${globalIdx + 1}`
              const isTextQ = q.answerScore01 == null  // 주관식
              const choiceLabels = [q.answer01, q.answer02, q.answer03, q.answer04, q.answer05].filter(Boolean)
              const isTwoChoice = !isTextQ && choiceLabels.length === 2
              const isYesNo = isTwoChoice && choiceLabels[0] === '예'
              const emojis5 = ['😞', '🙁', '😐', '😊', '😄']

              // 부연 설명 결정
              const refJob = answers[questions.findIndex(q2 => q2.answerScore01 == null)] // 42번 답변
              let contextNote = null
              if (isYesNo && qText.length < 20) {
                // 짧은 예/아니오 질문 = 진로 정보를 얻은 대상 목록
                contextNote = '최근 1년 이내에 진로 관련 정보나 도움을 받은 적이 있나요?'
              } else if (qText.startsWith('위에 적은')) {
                contextNote = refJob ? `42번에서 입력한 직업 "${refJob}"에 대한 질문입니다` : '42번에서 입력한 희망 직업에 대한 질문입니다'
              }

              return (
                <div key={globalIdx} style={{
                  ...card,
                  borderColor: !isUnanswered(selected) ? 'rgba(8,145,178,0.3)' : 'var(--card-border)',
                  transition: 'border-color 0.2s',
                }}>
                  {contextNote && (
                    <div style={{
                      padding: '7px 12px', borderRadius: 8, marginBottom: 12,
                      background: 'rgba(8,145,178,0.08)', border: '1px solid rgba(8,145,178,0.2)',
                      fontSize: '0.78rem', color: 'var(--teal)',
                      fontFamily: "'Noto Sans KR', sans-serif", lineHeight: 1.5,
                    }}>
                      💡 {contextNote}
                    </div>
                  )}
                  <p style={{
                    fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.95rem', lineHeight: 1.7,
                    color: 'var(--text-primary)', marginBottom: 16,
                  }}>
                    <span style={{ color: 'var(--teal)', fontWeight: 700, marginRight: 8 }}>{qNum}.</span>
                    {qText}
                  </p>

                  {/* 주관식 */}
                  {isTextQ && (
                    <input
                      type="text"
                      value={selected || ''}
                      onChange={e => setAnswer(globalIdx, e.target.value)}
                      placeholder="희망 직업을 입력하세요"
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 12, boxSizing: 'border-box',
                        fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.95rem',
                        background: 'var(--bg-3)', color: 'var(--text-primary)',
                        border: `2px solid ${selected ? 'var(--teal)' : 'var(--card-border)'}`,
                        outline: 'none', transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                      onBlur={e => e.target.style.borderColor = selected ? 'var(--teal)' : 'var(--card-border)'}
                    />
                  )}

                  {/* 2지선다 (예/아니오 등) — 위치값(1/2) 제출 */}
                  {!isTextQ && isTwoChoice && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {choiceLabels.map((label, val) => (
                        <button key={val} onClick={() => setAnswer(globalIdx, val + 1)} style={{
                          padding: '14px', borderRadius: 12, cursor: 'pointer',
                          fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem', fontWeight: 600,
                          border: `2px solid ${selected === val + 1 ? 'var(--teal)' : 'var(--card-border)'}`,
                          background: selected === val + 1 ? 'rgba(8,145,178,0.12)' : 'var(--bg-3)',
                          color: selected === val + 1 ? 'var(--teal)' : 'var(--text-secondary)',
                          transition: 'all 0.15s',
                        }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 다지선다 (3~5개) — 위치값(1~5) 제출 */}
                  {!isTextQ && !isTwoChoice && (
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
                      {choiceLabels.map((label, val) => (
                        <button key={val} onClick={() => setAnswer(globalIdx, val + 1)} style={{
                          flex: 1, padding: '10px 4px', borderRadius: 12, cursor: 'pointer',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                          border: `2px solid ${selected === val + 1 ? 'var(--teal)' : 'var(--card-border)'}`,
                          background: selected === val + 1 ? 'rgba(8,145,178,0.12)' : 'var(--bg-3)',
                          transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => selected !== val + 1 && (e.currentTarget.style.borderColor = 'var(--teal)')}
                          onMouseLeave={e => selected !== val + 1 && (e.currentTarget.style.borderColor = 'var(--card-border)')}
                        >
                          {choiceLabels.length === 5 && (
                            <span style={{ fontSize: '1.1rem' }}>{emojis5[val]}</span>
                          )}
                          <span style={{
                            fontSize: '0.72rem', color: selected === val + 1 ? 'var(--teal)' : 'var(--text-muted)',
                            fontFamily: "'Noto Sans KR', sans-serif", fontWeight: selected === val + 1 ? 700 : 400,
                            textAlign: 'center', lineHeight: 1.3,
                          }}>
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
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
                    const firstUnanswered = currentQs.findIndex((_, i) => isUnanswered(answers[page * PER_PAGE + i]))
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
              결과를 앱 안에서 바로 확인하세요.
            </p>

            {resultUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                {/* 메인: 앱 내 결과 보기 */}
                <button
                  onClick={() => setShowViewer(true)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '16px 32px', borderRadius: 14, cursor: 'pointer', border: 'none',
                    background: 'linear-gradient(135deg, var(--purple), var(--teal))',
                    color: '#fff', fontSize: '1rem', fontWeight: 700,
                    fontFamily: "'Noto Sans KR', sans-serif",
                    boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
                    transition: 'transform 0.15s, opacity 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.opacity = '0.9' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.opacity = '1' }}
                >
                  📊 결과 확인하기
                </button>
                {/* 보조: 외부 링크 */}
                <a
                  href={resultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.78rem', color: 'var(--text-muted)',
                    fontFamily: "'Noto Sans KR', sans-serif", textDecoration: 'underline',
                  }}
                >
                  커리어넷에서 열기 ↗
                </a>
              </div>
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

            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
                결과가 마이페이지에 저장되었습니다
              </p>
            </div>
          </div>

          {/* 인앱 결과 요약 */}
          {resultData && <ResultSummaryCard result={resultData} version={version} onView={() => setShowViewer(true)} />}

          {/* 임시 디버그 패널 — API 응답 구조 확인용 */}
          {resultData && (
            <details style={{ ...card, marginBottom: 20, fontSize: '0.75rem' }}>
              <summary style={{ cursor: 'pointer', fontFamily: "'Noto Sans KR', sans-serif", color: 'var(--text-muted)', marginBottom: 8 }}>
                🛠 디버그: API 응답 구조 (개발자용)
              </summary>
              <pre style={{
                background: 'var(--bg-3)', borderRadius: 8, padding: 12, overflowX: 'auto',
                fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-secondary)',
                maxHeight: 300, overflowY: 'auto', marginTop: 8,
              }}>
                {JSON.stringify(resultData, null, 2)}
              </pre>
            </details>
          )}

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

    {/* 결과 뷰어 모달 */}
    {showViewer && resultUrl && (
      <CareerResultViewer
        url={resultUrl}
        versionName={VERSION_INFO[version]?.name}
        onClose={() => setShowViewer(false)}
      />
    )}
    </>
  )
}
