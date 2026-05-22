import { useState } from 'react'
import { regionData } from '../data/publicData'

// 17개 시도 — 도/광역시 먼저, 소규모 시 나중에 (z-order)
const PROVINCES = [
  { id: '강원', d: 'M220,78 L308,70 L315,148 L280,170 L246,166 L220,142 Z', cx: 268, cy: 118 },
  { id: '경기', d: 'M150,100 L220,95 L228,148 L215,172 L182,175 L156,167 L146,138 Z', cx: 188, cy: 138 },
  { id: '인천', d: 'M128,116 L156,112 L162,140 L154,157 L128,150 Z', cx: 146, cy: 134 },
  { id: '충북', d: 'M218,172 L258,167 L268,208 L244,230 L210,224 L198,198 Z', cx: 234, cy: 198 },
  { id: '충남', d: 'M138,174 L188,172 L198,198 L184,226 L155,232 L126,214 L126,187 Z', cx: 160, cy: 202 },
  { id: '경북', d: 'M246,170 L310,160 L320,208 L293,242 L248,235 L228,207 Z', cx: 278, cy: 198 },
  { id: '전북', d: 'M124,234 L188,228 L193,262 L164,280 L126,270 L114,252 Z', cx: 156, cy: 254 },
  { id: '전남', d: 'M108,274 L165,270 L172,308 L143,332 L106,318 L96,294 Z', cx: 136, cy: 298 },
  { id: '경남', d: 'M215,252 L292,242 L303,278 L272,308 L220,300 L203,274 Z', cx: 253, cy: 278 },
  { id: '울산', d: 'M293,242 L322,236 L328,268 L303,275 Z', cx: 313, cy: 256 },
  { id: '제주', d: 'M150,350 L220,344 L224,370 L190,377 L152,370 Z', cx: 188, cy: 360 },
]

const CITIES = [
  { id: '서울', d: 'M175,128 L197,124 L204,140 L198,154 L177,156 L169,142 Z', cx: 189, cy: 141 },
  { id: '세종', d: 'M189,198 L208,195 L210,213 L191,215 Z', cx: 200, cy: 206 },
  { id: '대전', d: 'M179,217 L200,214 L202,232 L181,234 Z', cx: 192, cy: 224 },
  { id: '광주', d: 'M153,272 L175,269 L178,288 L156,291 Z', cx: 166, cy: 280 },
  { id: '대구', d: 'M248,234 L282,230 L286,255 L253,259 Z', cx: 268, cy: 244 },
  { id: '부산', d: 'M271,295 L306,280 L313,305 L283,315 Z', cx: 293, cy: 299 },
]

const REGIONS = [...PROVINCES, ...CITIES]

const METRICS = [
  { key: 'clubDiversity',  label: '동아리 다양성', unit: '점' },
  { key: 'afterSchoolRate', label: '방과후 참여율', unit: '%' },
  { key: 'satisfaction',   label: '학교생활 만족도', unit: '점' },
  { key: 'ruralGap',       label: '도농 격차', unit: 'p' },
]

// 보라(낮음) → 청록(높음) / 격차는 청록(낮음=좋음) → 주황(높음=나쁨)
function getColor(value, key) {
  if (key === 'ruralGap') {
    const ratio = Math.min(value / 28, 1)
    const r = Math.round(0   + ratio * 240)
    const g = Math.round(201 - ratio * 140)
    const b = Math.round(167 - ratio * 150)
    return `rgba(${r},${g},${b},0.88)`
  }
  // 실제 데이터 범위 55~95 기준으로 정규화
  const ratio = Math.max(0, Math.min((value - 55) / 40, 1))
  const r = Math.round(124 - ratio * 116)   // 124 → 8
  const g = Math.round(58  + ratio * 143)   // 58  → 201
  const b = Math.round(237 - ratio * 70)    // 237 → 167
  return `rgba(${r},${g},${b},0.88)`
}

export default function KoreaMap() {
  const [activeMetric, setActiveMetric] = useState('clubDiversity')
  const [hovered, setHovered]   = useState(null)
  const [selected, setSelected] = useState(null)

  const active = selected || hovered
  const info   = active ? regionData[active] : null

  return (
    <div>
      {/* 지표 선택 */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {METRICS.map(m => (
          <button key={m.key} onClick={() => setActiveMetric(m.key)} style={{
            padding: '8px 18px', borderRadius: 50, fontSize: '0.85rem',
            fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 500, cursor: 'pointer',
            background: activeMetric === m.key
              ? 'linear-gradient(135deg, var(--purple), var(--teal))'
              : 'var(--card-bg)',
            border: `1px solid ${activeMetric === m.key ? 'transparent' : 'var(--card-border)'}`,
            color: activeMetric === m.key ? '#fff' : 'var(--text-secondary)',
            transition: 'all 0.2s',
          }}>
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
        {/* SVG 지도 */}
        <svg viewBox="88 62 248 325" style={{ width: '100%', maxWidth: 440 }}>
          {REGIONS.map(region => {
            const val     = regionData[region.id]?.[activeMetric] ?? 70
            const fill    = getColor(val, activeMetric)
            const isCity  = CITIES.some(c => c.id === region.id)
            const isActive = region.id === active
            return (
              <g key={region.id}>
                <path
                  d={region.d}
                  fill={fill}
                  stroke={isActive ? '#fff' : isCity ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)'}
                  strokeWidth={isActive ? 2.5 : isCity ? 1.2 : 0.7}
                  opacity={isActive ? 1 : 0.87}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={() => setHovered(region.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(s => s === region.id ? null : region.id)}
                />
                <text
                  x={region.cx} y={region.cy}
                  textAnchor="middle"
                  fontSize={isCity ? 5.5 : 7}
                  fill="#fff"
                  opacity={0.95}
                  style={{ pointerEvents: 'none', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600 }}
                >
                  {region.id}
                </text>
              </g>
            )
          })}
        </svg>

        {/* 상세 패널 */}
        <div>
          {info ? (
            <div style={{
              background: 'var(--card-bg)', border: '1px solid var(--card-border)',
              borderRadius: 16, padding: 20, animation: 'fadeUp 0.3s ease',
            }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
                {active}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {METRICS.map(m => (
                  <div key={m.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
                        {m.label}
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--purple-light)', fontFamily: "'Noto Sans KR', sans-serif" }}>
                        {info[m.key]}{m.unit}
                      </span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${m.key === 'ruralGap' ? (info[m.key] / 30 * 100) : info[m.key]}%`,
                        background: m.key === 'ruralGap'
                          ? 'linear-gradient(90deg, #00C9A7, #F5A623)'
                          : 'linear-gradient(90deg, var(--purple), var(--teal))',
                        borderRadius: 3, transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              background: 'var(--card-bg)', border: '1px solid var(--card-border)',
              borderRadius: 16, padding: 20, textAlign: 'center',
              color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem',
            }}>
              지도에서 지역을 클릭하면<br />상세 통계를 볼 수 있습니다
            </div>
          )}

          {/* 범례 */}
          <div style={{ marginTop: 16, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8, fontFamily: "'Noto Sans KR', sans-serif" }}>
              {activeMetric === 'ruralGap' ? '낮음(좋음) → 높음(나쁨)' : '낮음 → 높음'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                flex: 1, height: 8, borderRadius: 4,
                background: activeMetric === 'ruralGap'
                  ? 'linear-gradient(90deg, #00C9A7, #F5A623)'
                  : 'linear-gradient(90deg, #7C3AED, #00C9A7)',
              }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>높음</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
