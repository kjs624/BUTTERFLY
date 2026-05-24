import { useState } from 'react'
import { regionData } from '../data/publicData'

// Simple equirectangular projection for Korea
// x = (lon - 127.7) * 122 + 250,  y = (36.0 - lat) * 92.6 + 280
const px = lon => (lon - 127.7) * 122 + 250
const py = lat => (36.0 - lat) * 92.6 + 280

// Province bounding boxes [west, east, south, north]
// Larger provinces first (rendered behind cities)
const REGIONS = [
  { key: '경기', w: 126.43, e: 128.08, s: 37.00, n: 38.30 },
  { key: '강원', w: 127.70, e: 129.33, s: 37.00, n: 38.62 },
  { key: '충북', w: 127.33, e: 128.57, s: 36.19, n: 37.47 },
  { key: '충남', w: 125.96, e: 127.33, s: 35.98, n: 37.08 },
  { key: '전북', w: 126.31, e: 127.90, s: 35.33, n: 36.01 },
  { key: '전남', w: 126.18, e: 127.72, s: 34.17, n: 35.33 },
  { key: '경북', w: 128.08, e: 129.41, s: 35.57, n: 37.09 },
  { key: '경남', w: 127.61, e: 129.37, s: 34.72, n: 35.57 },
  { key: '인천', w: 126.12, e: 126.84, s: 37.17, n: 37.83 },
  { key: '서울', w: 126.78, e: 127.18, s: 37.43, n: 37.70 },
  { key: '세종', w: 127.20, e: 127.39, s: 36.46, n: 36.66 },
  { key: '대전', w: 127.27, e: 127.62, s: 36.19, n: 36.49 },
  { key: '광주', w: 126.78, e: 126.99, s: 35.05, n: 35.27 },
  { key: '대구', w: 128.46, e: 128.83, s: 35.67, n: 35.96 },
  { key: '울산', w: 129.00, e: 129.46, s: 35.33, n: 35.79 },
  { key: '부산', w: 128.80, e: 129.22, s: 35.02, n: 35.40 },
  { key: '제주', w: 126.15, e: 126.95, s: 33.22, n: 33.56 },
]

const METRICS = [
  { key: 'clubDiversity',   label: '동아리 다양성',   unit: '점', min: 55, max: 95 },
  { key: 'afterSchoolRate', label: '방과후 참여율',   unit: '%',  min: 50, max: 90 },
  { key: 'satisfaction',    label: '학교생활 만족도', unit: '점', min: 58, max: 82 },
  { key: 'ruralGap',        label: '도농 격차',       unit: 'p',  min: 0,  max: 30 },
]

const PALETTE_SCORE = ['#1E1B4B','#3730A3','#6D28D9','#8B5CF6','#0891B2','#0E9F6E','#00C9A7']
const PALETTE_GAP   = ['#00C9A7','#10B981','#84CC16','#EAB308','#F97316','#EF4444','#991B1B']

function getColor(value, metric) {
  const ratio = Math.max(0, Math.min((value - metric.min) / (metric.max - metric.min), 1))
  const palette = metric.key === 'ruralGap' ? PALETTE_GAP : PALETTE_SCORE
  return palette[Math.round(ratio * (palette.length - 1))]
}

const LEGEND_LABELS_SCORE = ['최하', '하', '중하', '중', '중상', '상', '최상']
const LEGEND_LABELS_GAP   = ['격차없음', '', '', '중간', '', '', '격차큼']

// City-level regions (small, show short label only on hover)
const SMALL_REGIONS = new Set(['서울','인천','세종','대전','광주','대구','울산','부산'])

export default function KoreaMap() {
  const [activeMetric, setActiveMetric] = useState('clubDiversity')
  const [hovered,  setHovered]  = useState(null)
  const [selected, setSelected] = useState(null)

  const metric       = METRICS.find(m => m.key === activeMetric)
  const activeRegion = selected || hovered
  const info         = activeRegion ? regionData[activeRegion] : null
  const palette      = activeMetric === 'ruralGap' ? PALETTE_GAP : PALETTE_SCORE

  return (
    <div>
      {/* 지표 선택 탭 */}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24, alignItems: 'start' }}>
        {/* 지도 */}
        <div style={{ background: 'var(--bg-2)', borderRadius: 16, overflow: 'hidden' }}>
          <svg
            viewBox="0 0 500 560"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {REGIONS.map(r => {
              const val      = regionData[r.key]?.[activeMetric] ?? metric.min
              const fill     = getColor(val, metric)
              const isActive = r.key === activeRegion
              const x1 = px(r.w), x2 = px(r.e)
              const y1 = py(r.n), y2 = py(r.s)
              const cx = (x1 + x2) / 2
              const cy = (y1 + y2) / 2
              const w  = x2 - x1
              const h  = y2 - y1
              const small = SMALL_REGIONS.has(r.key)
              const fontSize = small ? 8 : Math.min(13, w / 3)

              return (
                <g
                  key={r.key}
                  onMouseEnter={() => setHovered(r.key)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(s => s === r.key ? null : r.key)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={x1} y={y1} width={w} height={h}
                    fill={fill}
                    stroke={isActive ? '#fff' : 'rgba(255,255,255,0.35)'}
                    strokeWidth={isActive ? 2 : 0.8}
                    opacity={isActive ? 1 : hovered && hovered !== r.key ? 0.75 : 0.92}
                    rx={2}
                  />
                  {w > 22 && h > 12 && (
                    <text
                      x={cx} y={cy + fontSize * 0.38}
                      textAnchor="middle"
                      fontSize={fontSize}
                      fontFamily="'Noto Sans KR', sans-serif"
                      fontWeight={600}
                      fill="rgba(255,255,255,0.9)"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {r.key}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* 오른쪽 패널 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {info ? (
            <div style={{
              background: 'var(--card-bg)', border: '1px solid var(--card-border)',
              borderRadius: 16, padding: 20, animation: 'fadeUp 0.3s ease',
            }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: 16, fontFamily: "'DM Serif Display', serif" }}>
                📍 {activeRegion}
              </h3>
              {METRICS.map(m => {
                const v   = info[m.key]
                const pct = Math.max(5, ((v - m.min) / (m.max - m.min)) * 100)
                return (
                  <div key={m.key} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
                        {m.label}
                      </span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: getColor(v, m), fontFamily: "'Noto Sans KR', sans-serif" }}>
                        {v}{m.unit}
                      </span>
                    </div>
                    <div style={{ height: 7, background: 'var(--bg-3)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: getColor(v, m),
                        borderRadius: 4, transition: 'width 0.5s ease',
                      }}/>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{
              background: 'var(--card-bg)', border: '1px solid var(--card-border)',
              borderRadius: 16, padding: 24, textAlign: 'center',
              color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.88rem',
              lineHeight: 1.8,
            }}>
              🗺️<br/>지도에서 지역을 클릭하면<br/>상세 통계를 볼 수 있습니다
            </div>
          )}

          {/* 범례 */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 10, fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600 }}>
              {metric.label} 범례
            </p>
            <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
              {palette.map((c, i) => (
                <div key={i} style={{ flex: 1, height: 14, background: c, borderRadius: 3 }}/>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {(activeMetric === 'ruralGap' ? LEGEND_LABELS_GAP : LEGEND_LABELS_SCORE).map((l, i) => (
                <span key={i} style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>{l}</span>
              ))}
            </div>

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--card-border)' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 4 }}>전국 평균</p>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--purple-light)', fontFamily: "'DM Serif Display', serif" }}>
                {(Object.values(regionData).reduce((s, v) => s + v[activeMetric], 0) / 17).toFixed(1)}{metric.unit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
