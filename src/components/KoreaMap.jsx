import { useState, useEffect } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { regionData } from '../data/publicData'

const GEO_URL = '/korea.json'

const NAME_MAP = {
  '서울특별시': '서울', '부산광역시': '부산', '대구광역시': '대구',
  '인천광역시': '인천', '광주광역시': '광주', '대전광역시': '대전',
  '울산광역시': '울산', '세종특별자치시': '세종', '세종특별자치시 ': '세종',
  '경기도': '경기', '강원도': '강원', '강원특별자치도': '강원',
  '충청북도': '충북', '충청남도': '충남',
  '전라북도': '전북', '전북특별자치도': '전북', '전라남도': '전남',
  '경상북도': '경북', '경상남도': '경남',
  '제주특별자치도': '제주',
}

const METRICS = [
  { key: 'clubDiversity',   label: '동아리 다양성',   unit: '점', min: 55, max: 95 },
  { key: 'afterSchoolRate', label: '방과후 참여율',   unit: '%',  min: 50, max: 90 },
  { key: 'satisfaction',    label: '학교생활 만족도', unit: '점', min: 58, max: 82 },
  { key: 'ruralGap',        label: '도농 격차',       unit: 'p',  min: 0,  max: 30 },
]

const PALETTE_SCORE = ['#1E1B4B','#3730A3','#6D28D9','#8B5CF6','#0891B2','#0E9F6E','#00C9A7']
const PALETTE_GAP   = ['#00C9A7','#10B981','#84CC16','#EAB308','#F97316','#EF4444','#991B1B']

function getColor(value, metric) {
  const { min, max, key } = metric
  const ratio = Math.max(0, Math.min((value - min) / (max - min), 1))
  const palette = key === 'ruralGap' ? PALETTE_GAP : PALETTE_SCORE
  const idx = Math.round(ratio * (palette.length - 1))
  return palette[idx]
}

const LEGEND_LABELS_SCORE = ['최하', '하', '중하', '중', '중상', '상', '최상']
const LEGEND_LABELS_GAP   = ['격차없음', '', '', '중간', '', '', '격차큼']

export default function KoreaMap() {
  const [activeMetric, setActiveMetric] = useState('clubDiversity')
  const [hovered,  setHovered]  = useState(null)
  const [selected, setSelected] = useState(null)
  const [geoData,  setGeoData]  = useState(null)
  const [geoError, setGeoError] = useState(false)

  useEffect(() => {
    fetch(GEO_URL)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(data => setGeoData(data))
      .catch(() => setGeoError(true))
  }, [])

  const metric      = METRICS.find(m => m.key === activeMetric)
  const activeRegion = selected || hovered
  const info         = activeRegion ? regionData[activeRegion] : null
  const palette      = activeMetric === 'ruralGap' ? PALETTE_GAP : PALETTE_SCORE

  const getRegionKey = (props) => {
    const raw = props.CTP_KOR_NM || props.name_kor || props.NAME_1 || ''
    return NAME_MAP[raw.trim()] || raw
  }

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
        <div style={{ background: 'var(--bg-2)', borderRadius: 16, overflow: 'hidden', minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {geoError ? (
            <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.88rem', textAlign: 'center', padding: 32 }}>
              🗺️<br/>지도 데이터를 불러올 수 없습니다<br/><span style={{ fontSize: '0.75rem' }}>네트워크 상태를 확인해주세요</span>
            </p>
          ) : !geoData ? (
            <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.88rem' }}>지도 로딩 중...</p>
          ) : (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ center: [127.8, 35.9], scale: 5500 }}
              style={{ width: '100%', height: 'auto' }}
              width={500}
              height={580}
            >
              <Geographies geography={geoData}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const key      = getRegionKey(geo.properties)
                    const val      = regionData[key]?.[activeMetric] ?? metric.min
                    const fill     = getColor(val, metric)
                    const isActive = key === activeRegion

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke={isActive ? '#fff' : 'rgba(255,255,255,0.3)'}
                        strokeWidth={isActive ? 2 : 0.7}
                        style={{
                          default: { outline: 'none', opacity: isActive ? 1 : 0.88, cursor: 'pointer', transition: 'opacity 0.15s' },
                          hover:   { outline: 'none', opacity: 1, filter: 'brightness(1.2)', cursor: 'pointer' },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={() => setHovered(key)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => setSelected(s => s === key ? null : key)}
                      />
                    )
                  })
                }
              </Geographies>
            </ComposableMap>
          )}
        </div>

        {/* 오른쪽 패널 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* 선택 지역 상세 */}
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
                <span key={i} style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
                  {l}
                </span>
              ))}
            </div>

            {/* 전국 평균 */}
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
