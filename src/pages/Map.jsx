import KoreaMap from '../components/KoreaMap'
import { nationalAvg } from '../data/publicData'
import StatCard from '../components/StatCard'

export default function Map() {
  return (
    <div className="page" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 20px 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeUp 0.4s ease' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', marginBottom: 12 }}>
          🗺️ 지역별 교육 격차 지도
        </h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif' " }}>
          17개 시도별 동아리 다양성·방과후 참여율·학교생활 만족도·도농 격차를 확인하세요
        </p>
      </div>

      {/* National averages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        <StatCard label="전국 동아리 다양성 평균" value={nationalAvg.clubDiversity} unit="점" icon="🎭" color="var(--purple-light)" sub="100점 기준" />
        <StatCard label="전국 방과후 참여율 평균" value={nationalAvg.afterSchoolRate} unit="%" icon="🎨" color="var(--teal)" />
        <StatCard label="전국 학교생활 만족도 평균" value={nationalAvg.satisfaction} unit="점" icon="😊" color="var(--mint)" sub="100점 기준" />
        <StatCard label="진로 연결률 평균" value={nationalAvg.careerLinkRate} unit="%" icon="🎯" color="var(--amber)" />
      </div>

      <div className="card" style={{ animation: 'fadeUp 0.4s ease 0.1s both' }}>
        <KoreaMap />
      </div>

      {/* Data source */}
      <div style={{ marginTop: 32, padding: 16, borderRadius: 12, background: 'var(--bg-2)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
          📌 출처: 학교알리미(schoolinfo.go.kr) · 교육통계서비스 KESS(kess.kedi.re.kr) · 2023년 기준 전처리 데이터
        </p>
      </div>
    </div>
  )
}
