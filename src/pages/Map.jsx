import KoreaMap from '../components/KoreaMap'
import { nationalAvg } from '../data/publicData'
import StatCard from '../components/StatCard'

export default function Map() {
  return (
    <div className="page" style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 16px 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: 28, animation: 'fadeUp 0.4s ease' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', marginBottom: 8 }}>
          🗺️ 지역별 교육 격차 지도
        </h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.88rem' }}>
          17개 시도별 교육 지표를 한눈에 확인하세요
        </p>
      </div>

      {/* National averages — 2×2 grid on mobile */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <StatCard label="전국 동아리 다양성" value={nationalAvg.clubDiversity} unit="점" icon="🎭" color="var(--purple-light)" sub="100점 기준" />
        <StatCard label="방과후 참여율" value={nationalAvg.afterSchoolRate} unit="%" icon="🎨" color="var(--teal)" />
        <StatCard label="학교생활 만족도" value={nationalAvg.satisfaction} unit="점" icon="😊" color="var(--mint)" sub="100점 기준" />
        <StatCard label="진로 연결률" value={nationalAvg.careerLinkRate} unit="%" icon="🎯" color="var(--amber)" />
      </div>

      <div className="card" style={{ animation: 'fadeUp 0.4s ease 0.1s both', padding: '16px' }}>
        <KoreaMap />
      </div>

      {/* Data source */}
      <div style={{ marginTop: 24, padding: '12px 16px', borderRadius: 12, background: 'var(--bg-2)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
          📌 출처: 학교알리미 · 교육통계서비스 KESS · 2023년 기준
        </p>
      </div>
    </div>
  )
}
