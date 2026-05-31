import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const STAT_CONFIG = [
  { key: 'clubDiversity',   label: '동아리 다양성', icon: '🎭', unit: '점', color: 'var(--purple)', colorRgb: '124,58,237' },
  { key: 'afterSchoolRate', label: '방과후 참여율', icon: '🎨', unit: '%',  color: 'var(--teal)',   colorRgb: '8,145,178' },
  { key: 'satisfaction',    label: '학교생활 만족도', icon: '😊', unit: '점', color: 'var(--mint)', colorRgb: '0,201,167' },
  { key: 'careerLinkRate',  label: '진로 연결률',   icon: '🎯', unit: '%',  color: '#f59e0b',      colorRgb: '245,158,11' },
]

const NATIONAL_AVG = { clubDiversity: 74, afterSchoolRate: 71, satisfaction: 70, careerLinkRate: 41 }

function GaugeBar({ value, avg, color }) {
  const pct = Math.min(100, Math.max(0, value))
  const avgPct = Math.min(100, Math.max(0, avg))
  return (
    <div style={{ position: 'relative', height: 8, background: 'var(--bg-3)', borderRadius: 99, overflow: 'visible', marginTop: 6 }}>
      <div style={{
        height: '100%', width: `${pct}%`, background: color,
        borderRadius: 99, transition: 'width 0.6s ease',
      }} />
      {/* 전국 평균 마커 */}
      <div style={{
        position: 'absolute', top: -3, left: `${avgPct}%`,
        width: 2, height: 14, background: 'var(--text-muted)',
        borderRadius: 1, transform: 'translateX(-50%)',
      }} title={`전국 평균 ${avg}`} />
    </div>
  )
}

function SchoolCard({ school, onSelect }) {
  const [expanded, setExpanded] = useState(false)
  const stats = school.stats || {}

  return (
    <div style={{
      background: 'var(--card-bg)', border: '1px solid var(--card-border)',
      borderRadius: 20, overflow: 'hidden',
      transition: 'all 0.2s', animation: 'fadeUp 0.3s ease',
    }}>
      {/* 헤더 */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          padding: '20px 24px', cursor: 'pointer', display: 'flex',
          justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <h3 style={{
              fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700,
              fontSize: '1rem', color: 'var(--text-primary)',
            }}>
              🏫 {school.name}
            </h3>
            <span style={{
              padding: '2px 8px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600,
              background: 'rgba(124,58,237,0.12)', color: 'var(--purple-light)',
              fontFamily: "'Noto Sans KR', sans-serif",
            }}>
              {school.type}
            </span>
            <span style={{
              padding: '2px 8px', borderRadius: 99, fontSize: '0.72rem',
              background: 'var(--bg-3)', color: 'var(--text-muted)',
              fontFamily: "'Noto Sans KR', sans-serif",
            }}>
              {school.region}
            </span>
          </div>
          <p style={{
            fontSize: '0.8rem', color: 'var(--text-muted)',
            fontFamily: "'Noto Sans KR', sans-serif",
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            📍 {school.address || '주소 정보 없음'}
          </p>
        </div>
        <span style={{
          fontSize: '0.85rem', color: 'var(--text-muted)', flexShrink: 0,
          transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s',
        }}>▾</span>
      </div>

      {/* 상세 데이터 */}
      {expanded && (
        <div style={{
          padding: '0 24px 20px', borderTop: '1px solid var(--card-border)',
          animation: 'fadeUp 0.2s ease',
        }}>
          <p style={{
            fontSize: '0.75rem', color: 'var(--text-muted)',
            fontFamily: "'Noto Sans KR', sans-serif", margin: '14px 0 16px',
          }}>
            📊 지역({school.region}) 교육 데이터 기반 추정 · 세로선(|)은 전국 평균
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
            {STAT_CONFIG.map(cfg => {
              const val = stats[cfg.key] ?? 0
              const avg = NATIONAL_AVG[cfg.key]
              const diff = val - avg
              return (
                <div key={cfg.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{
                      fontSize: '0.8rem', fontFamily: "'Noto Sans KR', sans-serif",
                      color: 'var(--text-secondary)', fontWeight: 600,
                    }}>
                      {cfg.icon} {cfg.label}
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: cfg.color }}>
                      {val}{cfg.unit}
                      <span style={{
                        fontSize: '0.7rem', marginLeft: 4,
                        color: diff >= 0 ? '#22c55e' : '#ef4444',
                      }}>
                        {diff >= 0 ? `+${diff}` : diff}
                      </span>
                    </span>
                  </div>
                  <GaugeBar value={val} avg={avg} color={cfg.color} />
                </div>
              )
            })}
          </div>

          {/* CTA 버튼 */}
          <button
            onClick={() => onSelect(school)}
            style={{
              width: '100%', padding: '13px', borderRadius: 14, cursor: 'pointer',
              fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.95rem', fontWeight: 700,
              background: 'linear-gradient(135deg, var(--purple), var(--teal))',
              border: 'none', color: '#fff',
              boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            🦋 이 학교로 나비효과 분석하기 →
          </button>
        </div>
      )}
    </div>
  )
}

export default function School() {
  const [query, setQuery] = useState('')
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [demo, setDemo] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  async function handleSearch(e) {
    e?.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setSchools([])
    setSearched(true)
    try {
      const res = await fetch(`${API_BASE}/api/school?name=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '검색 실패')
      setSchools(data.schools || [])
      setDemo(!!data.demo)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(school) {
    // 선택한 학교 정보를 가지고 Select 페이지로 이동 (학교명 pre-fill)
    navigate('/select', { state: { schoolName: school.name, schoolRegion: school.region, schoolStats: school.stats } })
  }

  return (
    <div className="page" style={{ maxWidth: 760, margin: '0 auto', padding: '80px 20px 60px' }}>
      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: 40, animation: 'fadeUp 0.4s ease' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', marginBottom: 12 }}>
          🏫 학교 검색
        </h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem' }}>
          학교를 검색해 동아리·방과후·만족도 데이터를 확인하고 나비효과를 분석하세요
        </p>
      </div>

      {/* 검색창 */}
      <form onSubmit={handleSearch} style={{ marginBottom: 32, animation: 'fadeUp 0.4s ease 0.05s both' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="학교 이름을 입력하세요 (예: 서울고등학교)"
              style={{
                width: '100%', padding: '14px 18px', borderRadius: 14,
                fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.95rem',
                background: 'var(--card-bg)', color: 'var(--text-primary)',
                border: '2px solid var(--card-border)',
                outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--purple)'}
              onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-primary"
            style={{ padding: '14px 24px', borderRadius: 14, fontSize: '0.95rem', flexShrink: 0 }}
          >
            {loading ? '검색 중...' : '🔍 검색'}
          </button>
        </div>
      </form>

      {/* 데모 모드 안내 */}
      {demo && (
        <div style={{
          padding: '12px 16px', borderRadius: 12, marginBottom: 20,
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)',
          fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.82rem',
          color: '#d97706', lineHeight: 1.6,
        }}>
          ⚠️ <strong>데모 모드</strong> — NEIS API 키가 설정되지 않아 샘플 학교 데이터를 표시합니다.
          실제 학교 검색을 사용하려면 <a href="https://open.neis.go.kr" target="_blank" rel="noopener noreferrer"
            style={{ color: '#d97706', fontWeight: 700 }}>NEIS Open API</a>에서 키를 발급 후
          Vercel 환경변수(NEIS_API_KEY)에 등록하세요.
        </div>
      )}

      {/* 오류 */}
      {error && (
        <div style={{
          padding: '12px 16px', borderRadius: 12, marginBottom: 20,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
          fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.85rem', color: '#ef4444',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* 결과 없음 */}
      {searched && !loading && !error && schools.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
          <p>"{query}"에 해당하는 학교를 찾지 못했습니다.</p>
          <p style={{ fontSize: '0.82rem', marginTop: 8 }}>학교명을 더 구체적으로 입력해보세요</p>
        </div>
      )}

      {/* 검색 전 가이드 */}
      {!searched && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14,
          animation: 'fadeUp 0.4s ease 0.1s both',
        }}>
          {[
            { icon: '🎭', title: '동아리 다양성', desc: '학교의 동아리 수와 다양성 지수를 확인할 수 있어요' },
            { icon: '🎨', title: '방과후 참여율', desc: '방과후 프로그램 참여 비율을 지역 평균과 비교해요' },
            { icon: '😊', title: '학교생활 만족도', desc: '학생들의 전반적인 학교생활 만족도 점수예요' },
            { icon: '🎯', title: '진로 연결률', desc: '학교 활동이 진로와 연결된 비율을 분석해요' },
          ].map(item => (
            <div key={item.title} style={{
              background: 'var(--card-bg)', border: '1px solid var(--card-border)',
              borderRadius: 16, padding: '20px 16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>{item.icon}</div>
              <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: '0.9rem', marginBottom: 6 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 검색 결과 */}
      {schools.length > 0 && (
        <div>
          <p style={{
            fontSize: '0.82rem', color: 'var(--text-muted)',
            fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 16,
          }}>
            {schools.length}개 학교 검색됨 · 카드를 클릭하면 상세 데이터를 확인할 수 있습니다
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {schools.map((school, i) => (
              <SchoolCard key={i} school={school} onSelect={handleSelect} />
            ))}
          </div>
        </div>
      )}

      {/* 데이터 출처 */}
      <div style={{ marginTop: 48, padding: '14px 20px', borderRadius: 12, background: 'var(--bg-2)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
          📌 출처: NEIS Open API (open.neis.go.kr) · 학교알리미 (schoolinfo.go.kr) · KESS · 2023년 기준 전처리
        </p>
      </div>
    </div>
  )
}
