import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import WaveCard from '../components/WaveCard'
import StatCard from '../components/StatCard'
import Slider from '../components/Slider'
import ChatBot from '../components/ChatBot'
import CompareCard from '../components/CompareCard'

function decodeShare(str) {
  try { return JSON.parse(decodeURIComponent(atob(str))) } catch { return null }
}

// stat 값이 긴 문자열로 올 경우 앞의 수치 부분만 추출
function shortStat(val, fallback) {
  if (!val) return fallback
  const match = String(val).match(/^([+\-]?\d+\.?\d*\s*%p?|[+\-]?\d+\.?\d*)/)
  return match ? match[1] : String(val).slice(0, 8)
}

export default function Result() {
  const { state } = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const shareParam = searchParams.get('share')
  const sharedData = shareParam ? decodeShare(shareParam) : null

  const result = sharedData?.result || state?.result
  const selections = sharedData?.selections || state?.selections
  const analysisId = state?.analysisId ?? null

  if (!result) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 40 }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>분석 결과가 없습니다.</p>
        <button className="btn-primary" onClick={() => navigate('/select')}>선택 화면으로 가기</button>
      </div>
    )
  }

  return (
    <div className="page" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 20px 60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeUp 0.4s ease' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', marginBottom: 12 }}>
          🦋 나비효과 분석 결과
        </h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
          당신의 선택이 만들어낼 연쇄 파급효과입니다
        </p>
      </div>

      {/* Summary */}
      {result.summary && (
        <div className="card" style={{ marginBottom: 32, background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.3)', animation: 'fadeUp 0.4s ease 0.1s both' }}>
          {result.summary.split('\n').filter(Boolean).map((line, i) => (
            <p key={i} style={{ lineHeight: 1.85, fontSize: '1rem', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: i < result.summary.split('\n').filter(Boolean).length - 1 ? 10 : 0 }}>
              {line}
            </p>
          ))}
        </div>
      )}

      {/* 3-stage wave */}
      <div style={{ display: 'grid', gap: 20, marginBottom: 40 }}>
        <WaveCard step="short" label="단기 효과 · 1~6개월" icon="⚡" delay={0.1}>
          {result.short}
        </WaveCard>
        <WaveCard step="mid" label="중기 효과 · 1~3년" icon="🌱" delay={0.2}>
          {result.mid}
        </WaveCard>
        <WaveCard step="long" label="장기 효과 · 졸업 이후" icon="🚀" delay={0.3}>
          {result.long}
        </WaveCard>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        <StatCard label="만족도 변화" value={shortStat(result.stat1, '+12%')} icon="😊" color="var(--purple-light)" />
        <StatCard label="진로 연결률" value={shortStat(result.stat2, '41%')} icon="🎯" color="var(--teal)" />
        <StatCard label="자기효능감 상승" value={shortStat(result.stat3, '+18%p')} icon="📈" color="var(--mint)" />
      </div>

      {/* Advice */}
      {result.advice && (
        <div className="card" style={{ marginBottom: 40, borderColor: 'rgba(0,201,167,0.3)', background: 'rgba(0,201,167,0.06)', animation: 'fadeUp 0.4s ease 0.4s both' }}>
          <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, marginBottom: 12, color: 'var(--mint)' }}>💡 AI 조언</h3>
          <p style={{ lineHeight: 1.8, fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.95rem' }}>{result.advice}</p>
        </div>
      )}

      {/* Gap warning */}
      {result.gap && (
        <div className="card" style={{ marginBottom: 40, borderColor: 'rgba(245,166,35,0.3)', background: 'rgba(245,166,35,0.06)', animation: 'fadeUp 0.4s ease 0.5s both' }}>
          <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, marginBottom: 12, color: 'var(--amber)' }}>⚠️ 격차 경보</h3>
          <p style={{ lineHeight: 1.8, fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.95rem' }}>{result.gap}</p>
        </div>
      )}

      <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', margin: '48px 0' }} />

      {/* STEP 1 — Slider */}
      <div style={{ marginBottom: 60 }}>
        <Slider />
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', margin: '48px 0' }} />

      {/* STEP 2 — ChatBot */}
      <div style={{ marginBottom: 60 }}>
        <ChatBot analysisResult={result} selections={selections} analysisId={analysisId} />
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', margin: '48px 0' }} />

      {/* STEP 3 — Compare */}
      <div style={{ marginBottom: 60 }}>
        <CompareCard myResult={result} mySelections={selections} />
      </div>

      {/* Sources */}
      {result.sources && (
        <div style={{ padding: 20, borderRadius: 12, background: 'var(--bg-2)', marginBottom: 32 }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
            📌 데이터 출처: {result.sources}
          </p>
        </div>
      )}

      <div style={{ textAlign: 'center', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn-outline" onClick={() => navigate('/select')}>다시 분석하기</button>
        <button className="btn-primary" onClick={() => navigate('/map')}>지역 지도 보기</button>
      </div>
    </div>
  )
}
