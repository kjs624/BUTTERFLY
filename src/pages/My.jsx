import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHistory } from '../hooks/useHistory'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../hooks/useAuth'
import { useCareerTest } from '../hooks/useCareerTest'
import StatCard from '../components/StatCard'

const CAREER_VERSION_INFO = {
  1: { name: '직업흥미검사 H형', icon: '🔍', badge: 'V1', color: 'var(--purple)' },
  2: { name: '직업흥미검사 K형', icon: '🎯', badge: 'V2', color: 'var(--teal)' },
}

const GENDER_OPTIONS = ['선택 안 함', '남성', '여성', '기타']
const GRADE_OPTIONS = ['선택 안 함', '상위 10%', '상위 30%', '중위권', '하위 30%', '하위 10%']

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: 'var(--bg-3)', border: '1px solid var(--card-border)',
  borderRadius: 10, color: 'var(--text-primary)',
  fontSize: '0.9rem', fontFamily: "'Noto Sans KR', sans-serif",
  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
}

const selectStyle = {
  ...inputStyle, cursor: 'pointer', appearance: 'none',
}

const textareaStyle = {
  ...inputStyle, resize: 'vertical', minHeight: 72,
}

const labelStyle = {
  fontSize: '0.75rem', color: 'var(--text-muted)',
  fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600,
  marginBottom: 5, display: 'block',
}

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

export default function My() {
  const { history, remove, clear, stats } = useHistory()
  const { user } = useAuth()
  const { profile, save, loading } = useProfile(user)
  const { results: careerResults, clearResult } = useCareerTest(user)
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({})

  function startEdit() {
    setDraft({ ...profile })
    setEditing(true)
  }

  async function handleSave() {
    await save(draft)
    setEditing(false)
  }

  function handleCancel() {
    setDraft({})
    setEditing(false)
  }

  const val = (k) => (editing ? draft : profile)[k] || ''
  const set = (k) => (e) => setDraft(d => ({ ...d, [k]: e.target.value }))

  const hasProfile = Object.values(profile).some(v => v && v !== '')

  return (
    <div className="page" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 20px 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40, animation: 'fadeUp 0.4s ease' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', marginBottom: 12 }}>
          나의 나비효과 기록
        </h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
          지금까지 분석한 나비효과 히스토리
        </p>
      </div>

      {/* Profile Section */}
      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: 20, padding: 28, marginBottom: 32, animation: 'fadeUp 0.4s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', marginBottom: 4 }}>
              내 프로필
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
              {user ? '정보가 자동으로 저장됩니다' : '로그인하면 정보가 저장됩니다'}
            </p>
          </div>
          {!editing ? (
            <button onClick={startEdit} style={{
              padding: '8px 18px', borderRadius: 50, fontSize: '0.82rem',
              fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600,
              background: 'linear-gradient(135deg, var(--purple), var(--teal))',
              color: '#fff', border: 'none', cursor: 'pointer',
            }}>
              {hasProfile ? '✏️ 수정' : '+ 입력하기'}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCancel} style={{
                padding: '8px 16px', borderRadius: 50, fontSize: '0.82rem',
                fontFamily: "'Noto Sans KR', sans-serif",
                background: 'var(--bg-3)', border: '1px solid var(--card-border)',
                color: 'var(--text-muted)', cursor: 'pointer',
              }}>
                취소
              </button>
              <button onClick={handleSave} style={{
                padding: '8px 18px', borderRadius: 50, fontSize: '0.82rem',
                fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600,
                background: 'linear-gradient(135deg, var(--purple), var(--teal))',
                color: '#fff', border: 'none', cursor: 'pointer',
              }}>
                저장
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.88rem' }}>불러오는 중...</p>
        ) : editing ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Field label="학교">
              <input style={inputStyle} placeholder="예: ○○고등학교" value={val('school')} onChange={set('school')}
                onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                onBlur={e => e.target.style.borderColor = 'var(--card-border)'} />
            </Field>
            <Field label="나이">
              <input style={inputStyle} type="number" placeholder="예: 17" min={10} max={30}
                value={val('age')} onChange={set('age')}
                onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                onBlur={e => e.target.style.borderColor = 'var(--card-border)'} />
            </Field>
            <Field label="성별">
              <select style={selectStyle} value={val('gender')} onChange={set('gender')}>
                {GENDER_OPTIONS.map(o => <option key={o} value={o === '선택 안 함' ? '' : o}>{o}</option>)}
              </select>
            </Field>
            <Field label="성적 수준">
              <select style={selectStyle} value={val('grades')} onChange={set('grades')}>
                {GRADE_OPTIONS.map(o => <option key={o} value={o === '선택 안 함' ? '' : o}>{o}</option>)}
              </select>
            </Field>
            <Field label="희망 전공">
              <input style={inputStyle} placeholder="예: 컴퓨터공학" value={val('desired_major')} onChange={set('desired_major')}
                onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                onBlur={e => e.target.style.borderColor = 'var(--card-border)'} />
            </Field>
            <Field label="희망 진로">
              <input style={inputStyle} placeholder="예: 소프트웨어 엔지니어" value={val('career_goal')} onChange={set('career_goal')}
                onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                onBlur={e => e.target.style.borderColor = 'var(--card-border)'} />
            </Field>
            <Field label="잘하는 것">
              <textarea style={textareaStyle} placeholder="예: 수학, 코딩, 발표" value={val('strengths')} onChange={set('strengths')}
                onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                onBlur={e => e.target.style.borderColor = 'var(--card-border)'} />
            </Field>
            <Field label="못하는 것">
              <textarea style={textareaStyle} placeholder="예: 체육, 영어 말하기" value={val('weaknesses')} onChange={set('weaknesses')}
                onFocus={e => e.target.style.borderColor = 'var(--purple)'}
                onBlur={e => e.target.style.borderColor = 'var(--card-border)'} />
            </Field>
          </div>
        ) : hasProfile ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            {[
              { label: '학교', key: 'school', icon: '🏫' },
              { label: '나이', key: 'age', icon: '🎂', suffix: '세' },
              { label: '성별', key: 'gender', icon: '👤' },
              { label: '성적', key: 'grades', icon: '📊' },
              { label: '희망 전공', key: 'desired_major', icon: '📚' },
              { label: '희망 진로', key: 'career_goal', icon: '🎯' },
              { label: '잘하는 것', key: 'strengths', icon: '💪' },
              { label: '못하는 것', key: 'weaknesses', icon: '📝' },
            ].filter(({ key }) => profile[key]).map(({ label, key, icon, suffix }) => (
              <div key={key} style={{
                background: 'var(--bg-2)', borderRadius: 12, padding: '12px 14px',
              }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 4 }}>
                  {icon} {label}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600, lineHeight: 1.4 }}>
                  {profile[key]}{suffix || ''}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.88rem' }}>
            프로필을 입력하면 맞춤 분석을 받을 수 있습니다
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="총 분석 횟수" value={stats.total} unit="회" icon="🦋" color="var(--purple-light)" />
        <StatCard label="가장 많이 선택한 동아리" value={stats.topClub} unit="" icon="🎭" color="var(--teal)" />
      </div>

      {/* 진로 심리 검사 섹션 */}
      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: 20, padding: 28, marginBottom: 32, animation: 'fadeUp 0.4s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', marginBottom: 4 }}>
              진로 심리 검사
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
              커리어넷 직업흥미검사 · V1(H형) · V2(K형)
            </p>
          </div>
          <button onClick={() => navigate('/career-test')} style={{
            padding: '8px 18px', borderRadius: 50, fontSize: '0.82rem',
            fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600,
            background: 'linear-gradient(135deg, var(--purple), var(--teal))',
            color: '#fff', border: 'none', cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            + 검사하기
          </button>
        </div>

        {Object.keys(careerResults).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.88rem', marginBottom: 16 }}>
              아직 진로 심리 검사를 하지 않았습니다
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[1, 2].map(v => {
                const info = CAREER_VERSION_INFO[v]
                return (
                  <button key={v} onClick={() => navigate(`/career-test`)} style={{
                    padding: '10px 20px', borderRadius: 12, cursor: 'pointer',
                    fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.85rem', fontWeight: 600,
                    border: `1.5px solid ${info.color}`,
                    background: 'transparent', color: info.color, transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = info.color; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = info.color }}
                  >
                    {info.icon} {info.name} 시작
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2].map(v => {
              const info = CAREER_VERSION_INFO[v]
              const result = careerResults[v]
              return (
                <div key={v} style={{
                  background: 'var(--bg-2)', borderRadius: 14, padding: '16px 18px',
                  border: result ? `1px solid ${info.color}33` : '1px solid var(--card-border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '1.5rem' }}>{info.icon}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: '0.9rem' }}>
                          {info.name}
                        </span>
                        <span style={{
                          padding: '2px 8px', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700,
                          background: info.color, color: '#fff', fontFamily: "'Noto Sans KR', sans-serif",
                        }}>
                          {info.badge}
                        </span>
                      </div>
                      {result ? (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
                          완료 · {new Date(result.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
                          미완료
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {result?.url && (
                      <a href={result.url} target="_blank" rel="noopener noreferrer" style={{
                        padding: '7px 14px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 600,
                        fontFamily: "'Noto Sans KR', sans-serif", textDecoration: 'none',
                        background: `${info.color}20`, color: info.color,
                        border: `1px solid ${info.color}50`, transition: 'all 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = info.color; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${info.color}20`; e.currentTarget.style.color = info.color }}
                      >
                        결과 보기
                      </a>
                    )}
                    <button onClick={() => navigate(`/career-test`)} style={{
                      padding: '7px 14px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 600,
                      fontFamily: "'Noto Sans KR', sans-serif", cursor: 'pointer',
                      background: 'var(--bg-3)', border: '1px solid var(--card-border)',
                      color: 'var(--text-secondary)', transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = info.color; e.currentTarget.style.color = info.color }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                    >
                      🔄 재검사
                    </button>
                    {result && (
                      <button onClick={() => clearResult(v)} style={{
                        padding: '7px 12px', borderRadius: 50, fontSize: '0.78rem',
                        fontFamily: "'Noto Sans KR', sans-serif", cursor: 'pointer',
                        background: 'transparent', border: '1px solid var(--card-border)',
                        color: 'var(--text-muted)', transition: 'all 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* History list */}
      {history.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          borderRadius: 20, animation: 'fadeUp 0.4s ease',
        }}>
          <p style={{ fontSize: '3rem', marginBottom: 16 }}>🦋</p>
          <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 24 }}>
            아직 분석 기록이 없습니다
          </p>
          <button className="btn-primary" onClick={() => navigate('/select')}>
            첫 나비효과 분석하기
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {history.map((entry, i) => (
              <div key={entry.id} className="card" style={{ animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
                      {new Date(entry.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <button onClick={() => remove(entry.id)} style={{
                    color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer',
                    fontFamily: "'Noto Sans KR', sans-serif", padding: '4px 10px',
                    border: '1px solid var(--card-border)', borderRadius: 50,
                    background: 'transparent', transition: 'all 0.2s',
                  }}>
                    삭제
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  {Object.entries(entry.selections || {}).map(([k, v]) => (
                    <span key={k} style={{
                      padding: '3px 10px', borderRadius: 50, fontSize: '0.78rem',
                      background: 'var(--bg-3)', color: 'var(--text-secondary)',
                      fontFamily: "'Noto Sans KR', sans-serif",
                    }}>
                      {k}: {v.length > 20 ? v.slice(0, 20) + '...' : v}
                    </span>
                  ))}
                </div>
                {entry.result?.summary && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: "'Noto Sans KR', sans-serif" }}>
                    {entry.result.summary.slice(0, 120)}...
                  </p>
                )}
                <button
                  onClick={() => navigate('/result', { state: { result: entry.result, selections: entry.selections } })}
                  style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--purple-light)', cursor: 'pointer', background: 'none', border: 'none', fontFamily: "'Noto Sans KR', sans-serif" }}
                >
                  전체 결과 보기 →
                </button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button className="btn-outline" onClick={clear} style={{ color: '#F5A623', borderColor: 'rgba(245,166,35,0.3)' }}>
              전체 기록 삭제
            </button>
          </div>
        </>
      )}

      {/* Data sources */}
      <div style={{ marginTop: 48, padding: 20, borderRadius: 12, background: 'var(--bg-2)' }}>
        <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>📌 활용 데이터 출처</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['학교알리미', 'schoolinfo.go.kr', '동아리·방과후·시설 현황'],
            ['교육통계서비스 KESS', 'kess.kedi.re.kr', '학교별 진학·취업 통계'],
            ['커리어넷', 'career.go.kr', '희망직업·진로연결 통계'],
            ['NEIS Open API', 'open.neis.go.kr', '학교 기본정보'],
            ['통계청 KOSIS', 'kosis.kr', '사교육비·청소년 통계'],
          ].map(([name, url, desc]) => (
            <div key={name} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: '0.82rem', fontFamily: "'Noto Sans KR', sans-serif" }}>
              <span style={{ color: 'var(--purple-light)', fontWeight: 600 }}>{name}</span>
              <span style={{ color: 'var(--text-muted)' }}>({url})</span>
              <span style={{ color: 'var(--text-secondary)' }}>— {desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
