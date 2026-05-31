import { useNavigate } from 'react-router-dom'
import ButterflyLogo from '../components/ButterflyLogo'

const features = [
  { icon: '🤖', title: 'Claude AI 분석', desc: '5가지 선택을 입력하면 Claude AI가 단기·중기·장기 나비효과를 분석합니다' },
  { icon: '📊', title: '공공데이터 기반', desc: '학교알리미·KESS·커리어넷 실제 수치로 뒷받침되는 분석' },
  { icon: '🗺️', title: '지역 격차 지도', desc: '17개 시도 지역별 교육 기회 격차를 인터랙티브 지도로 시각화' },
]

const steps = [
  { num: '01', label: '선택 입력', desc: '학습·동아리·공간·방과후·친구 5영역 서술' },
  { num: '02', label: 'AI 분석', desc: 'Claude가 공공데이터로 나비효과 추출' },
  { num: '03', label: '결과 확인', desc: '단기·중기·장기 3단계 파급효과 리포트' },
  { num: '04', label: '탐색', desc: '챗봇·친구 비교로 더 깊이 탐색' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page" style={{ background: 'var(--bg-1)' }}>
      {/* Hero */}
      <section style={{
        minHeight: '85vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '48px 20px 40px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(124,58,237,0.15) 0%, transparent 70%)',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 14px', borderRadius: 99, marginBottom: 20,
          background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)',
        }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--purple-light)', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700 }}>
            ✨ Claude AI × 공공데이터
          </span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <ButterflyLogo size={72} animate />
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(2.6rem, 11vw, 5.5rem)',
          lineHeight: 1.0, marginBottom: 14, letterSpacing: '0.04em',
        }}>
          BUTTERFLY
        </h1>
        <p style={{
          color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',
          marginBottom: 8, fontFamily: "'Noto Sans KR', sans-serif",
          fontWeight: 500,
        }}>
          학교에서의 선택이 만드는 나비효과
        </p>
        <p style={{
          color: 'var(--text-muted)', fontSize: 'clamp(0.78rem, 2.5vw, 0.88rem)',
          marginBottom: 36, fontFamily: "'Noto Sans KR', sans-serif",
          padding: '0 16px',
        }}>
          나의 선택이 1년 후, 5년 후 어떤 미래로 이어질까요?
        </p>

        <div style={{
          display: 'flex', gap: 10, flexDirection: 'column',
          width: '100%', maxWidth: 320, padding: '0 16px', boxSizing: 'border-box',
        }}>
          <button className="btn-primary" style={{ fontSize: '0.98rem', width: '100%' }} onClick={() => navigate('/select')}>
            🦋 나비효과 분석 시작
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-outline" style={{ flex: 1, fontSize: '0.85rem' }} onClick={() => navigate('/map')}>
              🗺️ 지역 지도
            </button>
            <button className="btn-outline" style={{ flex: 1, fontSize: '0.85rem' }} onClick={() => navigate('/school')}>
              🏫 학교 검색
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '60px 16px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: 8 }}>
            이용 방법
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: "'Noto Sans KR', sans-serif" }}>
            4단계로 나의 미래를 탐색해보세요
          </p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} style={{ animation: `fadeUp 0.5s ease ${i * 0.08}s both` }}>
              <div className="step-card"
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--purple)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = '' }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--purple), var(--teal))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12, margin: '0 auto 12px',
                }}>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>
                    {s.num}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, marginBottom: 6, fontSize: '0.95rem' }}>{s.label}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6, fontFamily: "'Noto Sans KR', sans-serif" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: '60px 16px', maxWidth: 1100, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: 8 }}>
            핵심 기능
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ animation: `fadeUp 0.5s ease ${i * 0.12}s both` }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7, fontFamily: "'Noto Sans KR', sans-serif" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 20px 80px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 480, margin: '0 auto',
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          borderRadius: 24, padding: '40px 24px',
        }}>
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>🦋</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.3rem, 5vw, 1.6rem)', marginBottom: 10 }}>
            지금 바로 시작해보세요
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.85rem', lineHeight: 1.6 }}>
            9개 교육 공공데이터 × 25종 데이터셋 × Claude AI
          </p>
          <button className="btn-primary" style={{ fontSize: '1rem', width: '100%', maxWidth: 280 }} onClick={() => navigate('/select')}>
            🦋 나비효과 분석 시작하기
          </button>
        </div>
      </section>
    </div>
  )
}
