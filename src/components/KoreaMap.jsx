import { useState, useMemo } from 'react'
import { geoMercator, geoPath, geoCentroid } from 'd3-geo'
import { regionData } from '../data/publicData'
import koreaGeo from '../data/koreaGeo.json'

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

const SMALL_KEYS = new Set(['서울','인천','세종','대전','광주','대구','울산','부산'])

const W = 480, H = 560

// 제주 분리
const mainlandFeatures = koreaGeo.features.filter(f => f.properties.key !== '제주')
const jejuFeature      = koreaGeo.features.find(f => f.properties.key === '제주')
const mainlandGeo      = { type: 'FeatureCollection', features: mainlandFeatures }

export default function KoreaMap() {
  const [activeMetric, setActiveMetric] = useState('clubDiversity')
  const [hovered,  setHovered]  = useState(null)
  const [selected, setSelected] = useState(null)

  // 본토 projection — 아래 여백(제주 공간) 80px 확보
  const projection = useMemo(() =>
    geoMercator().fitExtent([[20, 20], [W - 20, H - 90]], mainlandGeo),
  [])
  const pathGen = useMemo(() => geoPath(projection), [projection])

  // 제주 — 같은 projection으로 경도/위도 그대로, 단 화면 아래에 띄워서 표시
  // 제주 실제 centroid 화면 좌표
  const [jejuScreenX, jejuScreenY] = useMemo(() => {
    if (!jejuFeature) return [0, 0]
    const [lng, lat] = geoCentroid(jejuFeature)
    return projection([lng, lat])
  }, [projection])

  // 제주 path (같은 projection)
  const jejuPath = useMemo(() => pathGen(jejuFeature), [pathGen])

  // 제주를 화면 하단 중앙에 오프셋해서 재배치
  // 본토 최남단 y좌표 구하기
  const mainlandBottomY = useMemo(() => {
    let maxY = 0
    mainlandFeatures.forEach(f => {
      const [[x1,y1],[x2,y2]] = pathGen.bounds(f)
      if (y2 > maxY) maxY = y2
    })
    return maxY
  }, [pathGen])

  const jejuTargetY = mainlandBottomY + 45
  const jejuTargetX = W / 2

  // 제주 SVG transform: 현재 centroid → 목표 위치로 이동
  const jejuTransform = `translate(${jejuTargetX - jejuScreenX}, ${jejuTargetY - jejuScreenY})`

  const metric       = METRICS.find(m => m.key === activeMetric)
  const activeRegion = selected || hovered
  const info         = activeRegion ? regionData[activeRegion] : null
  const palette      = activeMetric === 'ruralGap' ? PALETTE_GAP : PALETTE_SCORE

  function renderFeature(feature) {
    const key      = feature.properties.key
    const val      = regionData[key]?.[activeMetric] ?? metric.min
    const fill     = getColor(val, metric)
    const isActive = key === activeRegion
    const d        = pathGen(feature)
    const [cx, cy] = pathGen.centroid(feature)
    const small    = SMALL_KEYS.has(key)
    const fontSize = small ? 7.5 : 11

    return (
      <g
        key={key}
        onMouseEnter={() => setHovered(key)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => setSelected(s => s === key ? null : key)}
        style={{ cursor: 'pointer' }}
      >
        <path
          d={d}
          fill={fill}
          stroke={isActive ? '#fff' : 'rgba(255,255,255,0.22)'}
          strokeWidth={isActive ? 2 : 0.6}
          opacity={isActive ? 1 : hovered && hovered !== key ? 0.65 : 0.88}
        />
        {!isNaN(cx) && !isNaN(cy) && (
          <text
            x={cx} y={cy + fontSize * 0.38}
            textAnchor="middle"
            fontSize={fontSize}
            fontFamily="'Noto Sans KR', sans-serif"
            fontWeight={700}
            fill="#fff"
            filter="url(#lbl-shadow)"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {key}
          </text>
        )}
      </g>
    )
  }

  // 제주 별도 렌더
  function renderJeju() {
    if (!jejuFeature) return null
    const key      = '제주'
    const val      = regionData[key]?.[activeMetric] ?? metric.min
    const fill     = getColor(val, metric)
    const isActive = key === activeRegion
    return (
      <g
        transform={jejuTransform}
        onMouseEnter={() => setHovered(key)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => setSelected(s => s === key ? null : key)}
        style={{ cursor: 'pointer' }}
      >
        <path
          d={jejuPath}
          fill={fill}
          stroke={isActive ? '#fff' : 'rgba(255,255,255,0.22)'}
          strokeWidth={isActive ? 2 : 0.6}
          opacity={isActive ? 1 : hovered && hovered !== key ? 0.65 : 0.88}
        />
        <text
          x={jejuScreenX} y={jejuScreenY + 4}
          textAnchor="middle"
          fontSize={10}
          fontFamily="'Noto Sans KR', sans-serif"
          fontWeight={700}
          fill="#fff"
          filter="url(#lbl-shadow)"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          제주
        </text>
      </g>
    )
  }

  return (
    <div>
      {/* 지표 선택 탭 */}
      <div className="map-tabs">
        {METRICS.map(m => (
          <button key={m.key} onClick={() => setActiveMetric(m.key)} className={`map-tab-btn${activeMetric === m.key ? ' active' : ''}`}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="map-layout">
        {/* 지도 SVG */}
        <div style={{ background: 'var(--bg-2)', borderRadius: 16, overflow: 'hidden' }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            <defs>
              <filter id="lbl-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#000" floodOpacity="0.9"/>
              </filter>
            </defs>

            {/* 본토 */}
            {mainlandFeatures.map(renderFeature)}

            {/* 제주 — 본토 아래에 분리하여 표시 */}
            {renderJeju()}
          </svg>
        </div>

        {/* 오른쪽·하단 패널 */}
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
