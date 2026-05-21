import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnalyze } from '../hooks/useAnalyze'
import { useHistory } from '../hooks/useHistory'

const AREAS = [
  {
    key: '학습',
    icon: '📚',
    label: '학습 방법',
    placeholder: '어떻게 공부하나요? 자기주도학습, 그룹스터디, 수업 집중 등...',
    tags: ['자기주도학습', '모둠 토론', '집중 수업', '프로젝트 학습', '반복 복습'],
  },
  {
    key: '동아리',
    icon: '🎭',
    label: '동아리 활동',
    placeholder: '어떤 동아리에 참여하고 싶거나 참여하고 있나요?',
    tags: ['밴드/음악', '코딩/IT', '미술/창작', '스포츠', '봉사활동', '과학탐구'],
  },
  {
    key: '공간',
    icon: '🏫',
    label: '학교 공간',
    placeholder: '학교에서 주로 어떤 공간을 사용하나요?',
    tags: ['도서관', '운동장', '메이커스페이스', '음악실', '미술실', '상담실'],
  },
  {
    key: '방과후',
    icon: '🎨',
    label: '방과후 활동',
    placeholder: '방과후에 무엇을 하나요?',
    tags: ['스포츠 클럽', '예술 수업', '코딩 교육', '봉사활동', '학습 보충', '자유 시간'],
  },
  {
    key: '친구관계',
    icon: '👥',
    label: '친구·관계',
    placeholder: '친구들과 어떻게 지내나요? 모둠, 멘토링, 동아리 친구 등...',
    tags: ['소수 깊은 친구', '넓은 교우 관계', '동아리 중심', '멘토링 참여', '온라인 교류'],
  },
]

export default function Select() {
  const [values, setValues] = useState({ 학습: '', 동아리: '', 공간: '', 방과후: '', 친구관계: '' })
  const [activeArea, setActiveArea] = useState(0)
  const { analyze, loading } = useAnalyze()
  const { save } = useHistory()
  const navigate = useNavigate()

  const allFilled = Object.values(values).every(v => v.trim().length > 0)
  const filled = Object.values(values).filter(v => v.trim()).length

  const addTag = (key, tag) => {
    setValues(prev => {
      const cur = prev[key]
      if (cur.includes(tag)) return prev
      return { ...prev, [key]: cur ? `${cur}, ${tag}` : tag }
    })
  }

  const handleAnalyze = async () => {
    try {
      const result = await analyze(values)
      save({ selections: values, result })
      navigate('/result', { state: { result, selections: values } })
    } catch (e) {
      alert('분석 중 오류가 발생했습니다: ' + e.message)
    }
  }

  return (
    <div className="page" style={{ padding: '80px 20px 40px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 40, animation: 'fadeUp 0.4s ease' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', marginBottom: 12 }}>
          나의 학교 선택 입력
        </h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
          5가지 영역을 솔직하게 작성할수록 더 정확한 나비효과를 분석받을 수 있어요
        </p>
      </div>

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

      {/* Analyze button */}
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button className="btn-primary" onClick={handleAnalyze} disabled={!allFilled || loading}
          style={{ fontSize: '1.05rem', padding: '16px 48px' }}>
          {loading ? '🦋 AI가 분석 중...' : '🦋 나비효과 분석하기'}
        </button>
        {!allFilled && (
          <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
            5가지 영역을 모두 입력해야 분석이 시작됩니다
          </p>
        )}
      </div>
    </div>
  )
}
