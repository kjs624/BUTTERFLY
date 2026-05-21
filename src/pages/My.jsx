import { useNavigate } from 'react-router-dom'
import { useHistory } from '../hooks/useHistory'
import StatCard from '../components/StatCard'

export default function My() {
  const { history, remove, clear, stats } = useHistory()
  const navigate = useNavigate()

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

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        <StatCard label="총 분석 횟수" value={stats.total} unit="회" icon="🦋" color="var(--purple-light)" />
        <StatCard label="가장 많이 선택한 동아리" value={stats.topClub} unit="" icon="🎭" color="var(--teal)" />
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
