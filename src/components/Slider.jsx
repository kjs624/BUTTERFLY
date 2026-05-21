import { useState, useEffect } from 'react'
import { clubData, afterSchoolData } from '../data/publicData'

function calcEffect(clubFreq, studyIntensity, afterDiversity) {
  const baseClub = 68 + clubFreq * 0.25
  const baseStudy = 60 + studyIntensity * 0.2
  const baseAfter = 58 + afterDiversity * 0.22

  return {
    satisfaction: Math.round((baseClub * 0.4 + baseStudy * 0.3 + baseAfter * 0.3)),
    careerLink: Math.round(28 + clubFreq * 0.15 + afterDiversity * 0.12),
    selfEfficacy: Math.round(62 + studyIntensity * 0.18 + clubFreq * 0.1),
    socialScore: Math.round(55 + clubFreq * 0.2 + afterDiversity * 0.15),
  }
}

export default function Slider() {
  const [clubFreq, setClubFreq] = useState(50)
  const [studyIntensity, setStudyIntensity] = useState(50)
  const [afterDiversity, setAfterDiversity] = useState(50)

  const effect = calcEffect(clubFreq, studyIntensity, afterDiversity)

  const sliders = [
    { label: '동아리 참여 빈도', value: clubFreq, set: setClubFreq, emoji: '🎭', lo: '가끔', hi: '매일' },
    { label: '학습 강도', value: studyIntensity, set: setStudyIntensity, emoji: '📚', lo: '여유롭게', hi: '집중적으로' },
    { label: '방과후 다양성', value: afterDiversity, set: setAfterDiversity, emoji: '🎨', lo: '한 가지', hi: '다양하게' },
  ]

  const metrics = [
    { key: 'satisfaction', label: '학교생활 만족도', color: 'var(--purple-light)', unit: '점' },
    { key: 'careerLink', label: '진로 연결률', color: 'var(--teal)', unit: '%' },
    { key: 'selfEfficacy', label: '자기효능감', color: 'var(--mint)', unit: '점' },
    { key: 'socialScore', label: '관계 만족도', color: 'var(--amber)', unit: '점' },
  ]

  return (
    <div>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', marginBottom: 8 }}>
        🎚️ 만약에 시뮬레이션
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 28, fontFamily: "'Noto Sans KR', sans-serif" }}>
        슬라이더를 조절하면 나비효과 수치가 실시간으로 변합니다
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
        {sliders.map(s => (
          <div key={s.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 600, fontFamily: "'Noto Sans KR', sans-serif" }}>{s.emoji} {s.label}</span>
              <span style={{ color: 'var(--purple-light)', fontWeight: 700 }}>{s.value}</span>
            </div>
            <input
              type="range" min="0" max="100" value={s.value}
              onChange={e => s.set(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--purple)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>{s.lo}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>{s.hi}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {metrics.map(m => (
          <div key={m.key} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8, fontFamily: "'Noto Sans KR', sans-serif" }}>{m.label}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: m.color, fontFamily: "'DM Serif Display', serif", transition: 'all 0.4s' }}>
              {effect[m.key]}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>{m.unit}</div>
            <div style={{ marginTop: 12, height: 6, background: 'var(--bg-3)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${effect[m.key]}%`,
                background: `linear-gradient(90deg, ${m.color}, ${m.color}88)`,
                borderRadius: 3, transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
