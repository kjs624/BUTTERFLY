import { useState } from 'react'
import { regionData } from '../data/publicData'

// 17개 시도 SVG 경로 (간략화)
const REGIONS = [
  { id: '서울', d: 'M178,134 L192,128 L202,135 L198,148 L183,150 Z', cx: 190, cy: 140 },
  { id: '인천', d: 'M158,140 L175,135 L178,148 L168,158 L155,152 Z', cx: 167, cy: 147 },
  { id: '경기', d: 'M168,112 L215,108 L230,148 L210,170 L178,162 L155,155 L158,132 Z', cx: 192, cy: 142 },
  { id: '강원', d: 'M218,98 L285,92 L298,130 L270,165 L230,155 L215,130 Z', cx: 255, cy: 130 },
  { id: '충북', d: 'M198,168 L240,162 L252,192 L230,215 L200,210 L185,188 Z', cx: 220, cy: 192 },
  { id: '충남', d: 'M150,168 L195,165 L198,198 L180,218 L148,212 L135,190 Z', cx: 167, cy: 192 },
  { id: '세종', d: 'M192,194 L205,190 L208,205 L195,210 Z', cx: 200, cy: 200 },
  { id: '대전', d: 'M183,205 L198,202 L200,218 L185,220 Z', cx: 192, cy: 212 },
  { id: '전북', d: 'M140,218 L190,215 L192,248 L165,268 L135,258 L125,235 Z', cx: 160, cy: 242 },
  { id: '전남', d: 'M128,262 L170,258 L175,295 L148,320 L118,308 L108,280 Z', cx: 144, cy: 288 },
  { id: '광주', d: 'M155,268 L172,265 L175,282 L158,285 Z', cx: 165, cy: 275 },
  { id: '경북', d: 'M240,162 L305,155 L315,200 L280,235 L240,228 L225,195 Z', cx: 270, cy: 195 },
  { id: '대구', d: 'M255,228 L278,225 L282,248 L260,252 Z', cx: 270, cy: 238 },
  { id: '경남', d: 'M215,248 L280,238 L295,268 L268,295 L228,290 L205,268 Z', cx: 250, cy: 270 },
  { id: '부산', d: 'M275,282 L300,272 L308,295 L285,302 Z', cx: 292, cy: 288 },
  { id: '울산', d: 'M295,252 L318,245 L322,268 L300,275 Z', cx: 308, cy: 260 },
  { id: '제주', d: 'M165,340 L215,335 L220,360 L190,368 L162,360 Z', cx: 192, cy: 352 },
]

const METRICS = [
  { key: 'clubDiversity', label: '동아리 다양성', unit: '점' },
  { key: 'afterSchoolRate', label: '방과후 참여율', unit: '%' },
  { key: 'satisfaction', label: '학교생활 만족도', unit: '점' },
  { key: 'ruralGap', label: '도농 격차', unit: 'p' },
]

function getColor(value, key, isDark) {
  const isGap = key === 'ruralGap'
  const ratio = isGap ? Math.min(value / 30, 1) : Math.min(value / 100, 1)
  if (isGap) {
    const r = Math.round(124 + ratio * 131)
    const g = Math.round(58 - ratio * 40)
    const b = Math.round(237 - ratio * 200)
    return `rgb(${r},${g},${b})`
  }
  const r = Math.round(8 + ratio * 0)
  const g = Math.round(145 + ratio * 56)
  const b = Math.round(178 - ratio * 11)
  return `rgb(${r},${g},${b})`
}

export default function KoreaMap({ theme }) {
  const [activeMetric, setActiveMetric] = useState('clubDiversity')
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)

  const active = selected || hovered
  const info = active ? regionData[active] : null

  return (
    <div>
      {/* Metric selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {METRICS.map(m => (
          <button key={m.key} onClick={() => setActiveMetric(m.key)} style={{
            padding: '8px 18px', borderRadius: 50, fontSize: '0.85rem',
            fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 500, cursor: 'pointer',
            background: activeMetric === m.key ? 'linear-gradient(135deg, var(--purple), var(--teal))' : 'var(--card-bg)',
            border: `1px solid ${activeMetric === m.key ? 'transparent' : 'var(--card-border)'}`,
            color: activeMetric === m.key ? '#fff' : 'var(--text-secondary)',
            transition: 'all 0.2s',
          }}>
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
        {/* SVG Map */}
        <svg viewBox="90 80 250 310" style={{ width: '100%', maxWidth: 440 }}>
          {REGIONS.map(r => {
            const val = regionData[r.id]?.[activeMetric] ?? 70
            const fill = getColor(val, activeMetric)
            const isActive = r.id === active
            return (
              <g key={r.id}>
                <path
                  d={r.d}
                  fill={fill}
                  stroke={isActive ? '#fff' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={isActive ? 2 : 0.8}
                  opacity={isActive ? 1 : 0.8}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={() => setHovered(r.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(s => s === r.id ? null : r.id)}
                />
                <text x={r.cx} y={r.cy} textAnchor="middle" fontSize="7" fill="#fff" opacity="0.9" style={{ pointerEvents: 'none', fontFamily: "'Noto Sans KR', sans-serif" }}>
                  {r.id}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Info panel */}
        <div>
          {info ? (
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 20, animation: 'fadeUp 0.3s ease' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>{active}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {METRICS.map(m => (
                  <div key={m.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>{m.label}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--purple-light)', fontFamily: "'Noto Sans KR', sans-serif" }}>{info[m.key]}{m.unit}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${m.key === 'ruralGap' ? (info[m.key] / 30 * 100) : info[m.key]}%`,
                        background: m.key === 'ruralGap' ? '#F5A623' : 'linear-gradient(90deg, var(--purple), var(--teal))',
                        borderRadius: 3, transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem' }}>
              지도에서 지역을 클릭하면 상세 통계를 볼 수 있습니다
            </div>
          )}

          {/* Legend */}
          <div style={{ marginTop: 16, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8, fontFamily: "'Noto Sans KR', sans-serif" }}>범례</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'linear-gradient(90deg, #0891B2, #00C9A7)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>높음</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
