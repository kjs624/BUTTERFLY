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
  { num: '04', label: '탐색', desc: '슬라이더·챗봇·친구 비교로 더 깊이 탐색' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page" style={{ background: 'var(--bg-1)' }}>
      {/* Hero */}
      <section style={{
        minHeight: '90vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '60px 20px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(124,58,237,0.15) 0%, transparent 70%)',
      }}>
        <div style={{ marginBottom: 28 }}>
          <ButterflyLogo size={120} />
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(3rem, 8vw, 5.5rem)',
          lineHeight: 1.05, marginBottom: 16, letterSpacing: '0.04em',
        }}>
          BUTTERFLY
        </h1>
        <p style={{
          color: 'var(--text-secondary)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          marginBottom: 40, fontFamily: "'Noto Sans KR', sans-serif",
        }}>
          학교에서의 선택이 만드는 나비효과
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn-primary" style={{ fontSize: '1.05rem' }} onClick={() => navigate('/select')}>
            🦋 나비효과 분석 시작
          </button>
          <button className="btn-outline" onClick={() => navigate('/map')}>
            지역 격차 지도 보기
          </button>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontFamily: "'DM Serif Display', serif", fontSize: '2rem', marginBottom: 48 }}>
          이용 방법
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}>
              <div style={{
                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                borderRadius: 20, padding: 28, textAlign: 'center',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--purple)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = '' }}
              >
                <div style={{
                  fontSize: '2rem', fontFamily: "'DM Serif Display', serif",
                  color: 'var(--purple-light)', marginBottom: 12,
                }}>{s.num}</div>
                <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, marginBottom: 8 }}>{s.label}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, fontFamily: "'Noto Sans KR', sans-serif" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: '80px 20px', maxWidth: 1100, margin: '0 auto',
        background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,201,167,0.06) 0%, transparent 70%)',
      }}>
        <h2 style={{ textAlign: 'center', fontFamily: "'DM Serif Display', serif", fontSize: '2rem', marginBottom: 48 }}>
          핵심 기능
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ animation: `fadeUp 0.5s ease ${i * 0.15}s both` }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, fontFamily: "'Noto Sans KR', sans-serif" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', marginBottom: 16 }}>
          지금 바로 시작해보세요
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontFamily: "'Noto Sans KR', sans-serif" }}>
          9개 교육 공공데이터 포털 × 25종 데이터셋 × Claude AI
        </p>
        <button className="btn-primary" style={{ fontSize: '1.1rem' }} onClick={() => navigate('/select')}>
          🦋 나비효과 분석 시작하기
        </button>
      </section>
    </div>
  )
}
