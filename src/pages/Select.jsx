import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAnalyze } from '../hooks/useAnalyze'
import { useHistory } from '../hooks/useHistory'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const SUBJECTS = ['국어', '수학', '영어', '과학', '사회', '역사', '기술·가정', '미술', '음악', '체육', '기타']

// 이미지 → base64 변환 + 압축 (canvas 리사이징)
function compressImage(file, maxWidth = 1024) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        const compressed = canvas.toDataURL('image/jpeg', 0.82)
        // data:image/jpeg;base64,XXX → XXX 부분만 추출
        resolve({ base64: compressed.split(',')[1], mediaType: 'image/jpeg', preview: compressed })
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

const AREAS = [
  {
    key: '학습',
    icon: '📚',
    label: '학습 방법',
    placeholder: '어떻게 공부하나요? 자기주도학습, 그룹스터디, 수업 집중 등...',
    tags: ['자기주도학습', '모둠 토론', '집중 수업', '프로젝트 학습', '반복 복습'],
    color: 'var(--purple)',
    colorRgb: '124,58,237',
  },
  {
    key: '동아리',
    icon: '🎭',
    label: '동아리 활동',
    placeholder: '어떤 동아리에 참여하고 싶거나 참여하고 있나요?',
    tags: ['밴드/음악', '코딩/IT', '미술/창작', '스포츠', '봉사활동', '과학탐구'],
    color: 'var(--teal)',
    colorRgb: '8,145,178',
  },
  {
    key: '공간',
    icon: '🏫',
    label: '학교 공간',
    placeholder: '학교에서 주로 어떤 공간을 사용하나요?',
    tags: ['도서관', '운동장', '메이커스페이스', '음악실', '미술실', '상담실'],
    color: 'var(--mint)',
    colorRgb: '0,201,167',
  },
  {
    key: '방과후',
    icon: '🎨',
    label: '방과후 활동',
    placeholder: '방과후에 무엇을 하나요?',
    tags: ['스포츠 클럽', '예술 수업', '코딩 교육', '봉사활동', '학습 보충', '자유 시간'],
    color: '#f59e0b',
    colorRgb: '245,158,11',
  },
  {
    key: '친구관계',
    icon: '👥',
    label: '친구·관계',
    placeholder: '친구들과 어떻게 지내나요? 모둠, 멘토링, 동아리 친구 등...',
    tags: ['소수 깊은 친구', '넓은 교우 관계', '동아리 중심', '멘토링 참여', '온라인 교류'],
    color: '#ec4899',
    colorRgb: '236,72,153',
  },
]

export default function Select() {
  const [mode, setMode] = useState('full') // 'full' | 'single' | 'poster' | 'project'

  // 전체 분석 상태
  const [values, setValues] = useState({ 학습: '', 동아리: '', 공간: '', 방과후: '', 친구관계: '' })
  const [activeArea, setActiveArea] = useState(0)

  // 단일 분석 상태
  const [singleArea, setSingleArea] = useState(null)
  const [singleValue, setSingleValue] = useState('')

  // 포스터 분석 상태
  const [posterFile, setPosterFile] = useState(null)   // { base64, mediaType, preview }
  const [posterLoading, setPosterLoading] = useState(false)
  const [posterError, setPosterError] = useState('')
  const fileInputRef = useRef(null)

  // 수행평가 분석 상태
  const [projectTopic, setProjectTopic] = useState('')
  const [projectSubject, setProjectSubject] = useState('')
  const [projectLoading, setProjectLoading] = useState(false)
  const [projectError, setProjectError] = useState('')

  const { analyze, loading } = useAnalyze()
  const { save } = useHistory()
  const navigate = useNavigate()
  const location = useLocation()
  const fromSchool = location.state?.schoolName || null
  const fromSchoolRegion = location.state?.schoolRegion || null

  const allFilled = Object.values(values).every(v => v.trim().length > 0)
  const filled = Object.values(values).filter(v => v.trim()).length

  const addTag = (key, tag) => {
    setValues(prev => {
      const cur = prev[key]
      if (cur.includes(tag)) return prev
      return { ...prev, [key]: cur ? `${cur}, ${tag}` : tag }
    })
  }

  const addSingleTag = (tag) => {
    setSingleValue(prev => {
      if (prev.includes(tag)) return prev
      return prev ? `${prev}, ${tag}` : tag
    })
  }

  // 전체 분석
  const handleAnalyzeFull = async () => {
    try {
      const result = await analyze(values, 'full')
      const analysisId = await save({ selections: values, result })
      navigate('/result', { state: { result, selections: values, analysisId } })
    } catch (e) {
      alert('분석 중 오류가 발생했습니다: ' + e.message)
    }
  }

  // 단일 분석
  const handleAnalyzeSingle = async () => {
    if (!singleArea || !singleValue.trim()) return
    try {
      const selections = { [singleArea]: singleValue }
      const result = await analyze(selections, 'single', singleArea)
      const analysisId = await save({ selections, result, mode: 'single', focusArea: singleArea })
      navigate('/result', { state: { result, selections, analysisId, mode: 'single', focusArea: singleArea } })
    } catch (e) {
      alert('분석 중 오류가 발생했습니다: ' + e.message)
    }
  }

  // 포스터 이미지 선택
  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPosterError('')
    try {
      const compressed = await compressImage(file)
      setPosterFile(compressed)
    } catch {
      setPosterError('이미지 처리 중 오류가 발생했습니다')
    }
  }

  // 포스터 분석 제출
  async function handlePosterAnalyze() {
    if (!posterFile) return
    setPosterLoading(true)
    setPosterError('')
    try {
      const res = await fetch(`${API_BASE}/api/poster`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: posterFile.base64, mediaType: posterFile.mediaType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '분석 실패')
      const analysisId = await save({ selections: { poster: posterFile.preview }, result: data, mode: 'poster' })
      navigate('/result', { state: { result: data, selections: {}, analysisId, mode: 'poster', posterInfo: data.posterInfo } })
    } catch (e) {
      setPosterError(e.message)
    } finally {
      setPosterLoading(false)
    }
  }

  // 수행평가 분석 제출
  async function handleProjectAnalyze() {
    if (!projectTopic.trim()) return
    setProjectLoading(true)
    setProjectError('')
    try {
      const res = await fetch(`${API_BASE}/api/project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: projectTopic, subject: projectSubject }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '분석 실패')
      const analysisId = await save({ selections: { topic: projectTopic, subject: projectSubject }, result: data, mode: 'project' })
      navigate('/result', { state: { result: data, selections: {}, analysisId, mode: 'project', projectTopic, projectSubject } })
    } catch (e) {
      setProjectError(e.message)
    } finally {
      setProjectLoading(false)
    }
  }

  const selectedAreaInfo = AREAS.find(a => a.key === singleArea)

  return (
    <div className="page" style={{ padding: '80px 20px 40px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 36, animation: 'fadeUp 0.4s ease' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', marginBottom: 12 }}>
          나의 학교 선택 입력
        </h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
          선택한 항목이 미래에 만들어낼 나비효과를 AI가 분석합니다
        </p>
        {fromSchool && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginTop: 14, padding: '8px 18px', borderRadius: 99,
            background: 'rgba(8,145,178,0.1)', border: '1px solid rgba(8,145,178,0.3)',
          }}>
            <span style={{ fontSize: '1rem' }}>🏫</span>
            <span style={{
              fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.85rem',
              fontWeight: 700, color: 'var(--teal)',
            }}>
              {fromSchool} ({fromSchoolRegion}) 선택됨
            </span>
          </div>
        )}
      </div>

      {/* 모드 탭 — 2×2 그리드 */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 36,
      }}>
        {[
          { id: 'full',    label: '🦋 전체 분석',  desc: '5가지 영역 모두' },
          { id: 'single',  label: '🔍 단일 분석',  desc: '1가지 영역만' },
          { id: 'poster',  label: '📸 포스터 분석', desc: '행사 포스터 촬영' },
          { id: 'project', label: '📝 수행평가 분석', desc: '주제 → 진로 연결' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setMode(tab.id)} style={{
            padding: '12px 10px', borderRadius: 12, cursor: 'pointer',
            fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.88rem', fontWeight: 700,
            border: `2px solid ${mode === tab.id ? 'transparent' : 'var(--card-border)'}`,
            transition: 'all 0.2s',
            background: mode === tab.id ? 'linear-gradient(135deg, var(--purple), var(--teal))' : 'var(--card-bg)',
            color: mode === tab.id ? '#fff' : 'var(--text-muted)',
            boxShadow: mode === tab.id ? '0 2px 12px rgba(124,58,237,0.25)' : 'none',
          }}>
            {tab.label}
            <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 400, opacity: 0.8, marginTop: 2 }}>
              {tab.desc}
            </span>
          </button>
        ))}
      </div>

      {/* ── 전체 분석 모드 ── */}
      {mode === 'full' && (
        <>
          {/* Progress */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>{filled}/5 영역 입력됨</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--purple-light)', fontFamily: "'Noto Sans KR', sans-serif" }}>{Math.round(filled / 5 * 100)}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${filled / 5 * 100}%`,
                background: 'linear-gradient(90deg, var(--purple), var(--teal))',
                borderRadius: 3, transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          {/* Area tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {AREAS.map((a, i) => (
              <button key={a.key} onClick={() => setActiveArea(i)} style={{
                padding: '8px 16px', borderRadius: 50, cursor: 'pointer',
                fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.85rem',
                background: activeArea === i ? 'linear-gradient(135deg, var(--purple), var(--teal))' : 'var(--card-bg)',
                border: `1px solid ${activeArea === i ? 'transparent' : values[a.key] ? 'var(--mint)' : 'var(--card-border)'}`,
                color: activeArea === i ? '#fff' : values[a.key] ? 'var(--mint)' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}>
                {a.icon} {a.label} {values[a.key] ? '✓' : ''}
              </button>
            ))}
          </div>

          {/* Active area input */}
          {AREAS.map((a, i) => i === activeArea && (
            <div key={a.key} style={{ animation: 'fadeUp 0.3s ease' }}>
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700 }}>
                    {a.icon} {a.label}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: values[a.key].length > 180 ? '#F5A623' : 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
                    {values[a.key].length}/200
                  </span>
                </div>
                <textarea
                  value={values[a.key]}
                  onChange={e => setValues(prev => ({ ...prev, [a.key]: e.target.value.slice(0, 200) }))}
                  placeholder={a.placeholder}
                  rows={4}
                  style={{
                    width: '100%', background: 'transparent', border: '1px solid var(--card-border)',
                    borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)',
                    fontSize: '0.95rem', resize: 'none', outline: 'none',
                    fontFamily: "'Noto Sans KR', sans-serif", lineHeight: 1.6,
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                  onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
                />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                  {a.tags.map(tag => (
                    <button key={tag} onClick={() => addTag(a.key, tag)} style={{
                      padding: '5px 12px', borderRadius: 50, cursor: 'pointer',
                      background: 'var(--bg-3)', border: '1px solid var(--card-border)',
                      color: 'var(--text-secondary)', fontSize: '0.8rem',
                      fontFamily: "'Noto Sans KR', sans-serif", transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => { e.target.style.borderColor = 'var(--purple)'; e.target.style.color = 'var(--purple-light)' }}
                      onMouseLeave={e => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.color = 'var(--text-secondary)' }}
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                {i > 0 && (
                  <button className="btn-outline" onClick={() => setActiveArea(i - 1)}>← 이전</button>
                )}
                {i < AREAS.length - 1 ? (
                  <button className="btn-primary" onClick={() => setActiveArea(i + 1)}>다음 →</button>
                ) : null}
              </div>
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button className="btn-primary" onClick={handleAnalyzeFull} disabled={!allFilled || loading}
              style={{ fontSize: '1.05rem', padding: '16px 48px' }}>
              {loading ? '🦋 AI가 분석 중...' : '🦋 나비효과 분석하기'}
            </button>
            {!allFilled && (
              <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
                5가지 영역을 모두 입력해야 분석이 시작됩니다
              </p>
            )}
          </div>
        </>
      )}

      {/* ── 단일 분석 모드 ── */}
      {mode === 'single' && (
        <div style={{ animation: 'fadeUp 0.3s ease' }}>
          {/* 영역 선택 카드 그리드 */}
          {!singleArea && (
            <>
              <p style={{
                textAlign: 'center', color: 'var(--text-muted)',
                fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem', marginBottom: 24,
              }}>
                분석할 영역을 하나 선택하세요
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 32 }}>
                {AREAS.map(a => (
                  <button key={a.key} onClick={() => { setSingleArea(a.key); setSingleValue('') }} style={{
                    padding: '24px 16px', borderRadius: 18, cursor: 'pointer', textAlign: 'center',
                    background: 'var(--card-bg)', border: `2px solid var(--card-border)`,
                    transition: 'all 0.2s', fontFamily: "'Noto Sans KR', sans-serif",
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = a.color
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = `0 8px 24px rgba(${a.colorRgb},0.2)`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--card-border)'
                      e.currentTarget.style.transform = ''
                      e.currentTarget.style.boxShadow = ''
                    }}
                  >
                    <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>{a.icon}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{a.label}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* 선택된 영역 입력 */}
          {singleArea && selectedAreaInfo && (
            <div style={{ animation: 'fadeUp 0.3s ease' }}>
              {/* 영역 변경 버튼 */}
              <button
                onClick={() => { setSingleArea(null); setSingleValue('') }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  marginBottom: 20, padding: '6px 14px', borderRadius: 99,
                  background: 'var(--bg-3)', border: '1px solid var(--card-border)',
                  color: 'var(--text-muted)', fontSize: '0.82rem',
                  fontFamily: "'Noto Sans KR', sans-serif", cursor: 'pointer',
                }}
              >
                ← 영역 다시 선택
              </button>

              {/* 선택된 영역 헤더 */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
                padding: '16px 20px', borderRadius: 16,
                background: `rgba(${selectedAreaInfo.colorRgb},0.08)`,
                border: `1px solid rgba(${selectedAreaInfo.colorRgb},0.25)`,
              }}>
                <span style={{ fontSize: '2rem' }}>{selectedAreaInfo.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: '1rem', color: selectedAreaInfo.color }}>
                    {selectedAreaInfo.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", marginTop: 2 }}>
                    이 영역만 집중 분석합니다
                  </div>
                </div>
              </div>

              <div className="card" style={{ marginBottom: 20, borderColor: `rgba(${selectedAreaInfo.colorRgb},0.3)` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700 }}>
                    {selectedAreaInfo.icon} {selectedAreaInfo.label}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: singleValue.length > 180 ? '#F5A623' : 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
                    {singleValue.length}/200
                  </span>
                </div>
                <textarea
                  value={singleValue}
                  onChange={e => setSingleValue(e.target.value.slice(0, 200))}
                  placeholder={selectedAreaInfo.placeholder}
                  rows={4}
                  style={{
                    width: '100%', background: 'transparent', border: '1px solid var(--card-border)',
                    borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)',
                    fontSize: '0.95rem', resize: 'none', outline: 'none',
                    fontFamily: "'Noto Sans KR', sans-serif", lineHeight: 1.6,
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = selectedAreaInfo.color}
                  onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
                />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                  {selectedAreaInfo.tags.map(tag => (
                    <button key={tag} onClick={() => addSingleTag(tag)} style={{
                      padding: '5px 12px', borderRadius: 50, cursor: 'pointer',
                      background: 'var(--bg-3)', border: '1px solid var(--card-border)',
                      color: 'var(--text-secondary)', fontSize: '0.8rem',
                      fontFamily: "'Noto Sans KR', sans-serif", transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = selectedAreaInfo.color; e.currentTarget.style.color = selectedAreaInfo.color }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  className="btn-primary"
                  onClick={handleAnalyzeSingle}
                  disabled={!singleValue.trim() || loading}
                  style={{ fontSize: '1.05rem', padding: '16px 48px' }}
                >
                  {loading ? '🔍 AI가 분석 중...' : `🔍 ${selectedAreaInfo.label} 분석하기`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 포스터 분석 모드 ── */}
      {mode === 'poster' && (
        <div style={{ animation: 'fadeUp 0.3s ease' }}>
          <p style={{
            textAlign: 'center', color: 'var(--text-muted)',
            fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem', marginBottom: 24,
          }}>
            학교 행사 포스터를 업로드하면 AI가 내용을 분석해 나비효과를 예측합니다
          </p>

          {/* 업로드 영역 */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${posterFile ? 'var(--purple)' : 'var(--card-border)'}`,
              borderRadius: 20, padding: 32, textAlign: 'center', cursor: 'pointer',
              background: posterFile ? 'rgba(124,58,237,0.04)' : 'var(--card-bg)',
              transition: 'all 0.2s', marginBottom: 20,
            }}
          >
            {posterFile ? (
              <>
                <img
                  src={posterFile.preview}
                  alt="업로드된 포스터"
                  style={{ maxWidth: '100%', maxHeight: 320, borderRadius: 12, marginBottom: 12, objectFit: 'contain' }}
                />
                <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.85rem', color: 'var(--purple-light)' }}>
                  ✓ 이미지 준비 완료 · 클릭하면 변경
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📸</div>
                <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, marginBottom: 6 }}>
                  포스터 이미지 업로드
                </p>
                <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  클릭하거나 파일을 드래그하세요 · JPG, PNG, HEIC
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {posterError && (
            <div style={{
              padding: '10px 14px', borderRadius: 10, marginBottom: 16,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444', fontSize: '0.85rem', fontFamily: "'Noto Sans KR', sans-serif",
            }}>{posterError}</div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              className="btn-primary"
              onClick={handlePosterAnalyze}
              disabled={!posterFile || posterLoading}
              style={{ fontSize: '1.05rem', padding: '16px 48px' }}
            >
              {posterLoading ? '📸 AI가 포스터 분석 중...' : '📸 포스터 나비효과 분석하기'}
            </button>
          </div>
        </div>
      )}

      {/* ── 수행평가 분석 모드 ── */}
      {mode === 'project' && (
        <div style={{ animation: 'fadeUp 0.3s ease' }}>
          <p style={{
            textAlign: 'center', color: 'var(--text-muted)',
            fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem', marginBottom: 24,
          }}>
            수행평가 주제를 입력하면 나비효과 분석 + 관련 직업 추천 + 진로 검사 안내를 받을 수 있어요
          </p>

          <div className="card" style={{ marginBottom: 20 }}>
            {/* 과목 선택 */}
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 10, fontWeight: 600 }}>
              과목 <span style={{ fontWeight: 400 }}>(선택)</span>
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {SUBJECTS.map(s => (
                <button key={s} onClick={() => setProjectSubject(prev => prev === s ? '' : s)} style={{
                  padding: '6px 14px', borderRadius: 99, cursor: 'pointer',
                  fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.82rem',
                  border: `2px solid ${projectSubject === s ? 'var(--purple)' : 'var(--card-border)'}`,
                  background: projectSubject === s ? 'rgba(124,58,237,0.1)' : 'var(--bg-3)',
                  color: projectSubject === s ? 'var(--purple-light)' : 'var(--text-secondary)',
                  fontWeight: projectSubject === s ? 700 : 400,
                  transition: 'all 0.15s',
                }}>
                  {s}
                </button>
              ))}
            </div>

            {/* 주제 입력 */}
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 10, fontWeight: 600 }}>
              수행평가 주제 <span style={{ color: '#ef4444' }}>*</span>
            </p>
            <textarea
              value={projectTopic}
              onChange={e => setProjectTopic(e.target.value.slice(0, 300))}
              placeholder="예: 기후변화가 생태계에 미치는 영향 / 인공지능과 미래 직업 변화 / 조선시대 신분제도 분석..."
              rows={4}
              style={{
                width: '100%', background: 'transparent', border: '1px solid var(--card-border)',
                borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)',
                fontSize: '0.95rem', resize: 'none', outline: 'none',
                fontFamily: "'Noto Sans KR', sans-serif", lineHeight: 1.6,
                transition: 'border-color 0.2s', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--purple)'}
              onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
            />
            <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: "'Noto Sans KR', sans-serif" }}>
              {projectTopic.length}/300
            </div>
          </div>

          {projectError && (
            <div style={{
              padding: '10px 14px', borderRadius: 10, marginBottom: 16,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444', fontSize: '0.85rem', fontFamily: "'Noto Sans KR', sans-serif",
            }}>{projectError}</div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              className="btn-primary"
              onClick={handleProjectAnalyze}
              disabled={!projectTopic.trim() || projectLoading}
              style={{ fontSize: '1.05rem', padding: '16px 48px' }}
            >
              {projectLoading ? '📝 AI가 분석 중...' : '📝 수행평가 나비효과 분석하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
