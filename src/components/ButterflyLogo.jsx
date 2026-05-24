export default function ButterflyLogo({ size = 80 }) {
  const s = size

  /* ── 날개 외곽 패스 ── */
  const upperLeft  = `M ${s*.5},${s*.30} C ${s*.38},${s*.03} ${s*.06},${s*.10} ${s*.08},${s*.35} C ${s*.10},${s*.55} ${s*.32},${s*.60} ${s*.5},${s*.52} Z`
  const upperRight = `M ${s*.5},${s*.30} C ${s*.62},${s*.03} ${s*.94},${s*.10} ${s*.92},${s*.35} C ${s*.90},${s*.55} ${s*.68},${s*.60} ${s*.5},${s*.52} Z`
  const lowerLeft  = `M ${s*.5},${s*.52} C ${s*.30},${s*.55} ${s*.10},${s*.65} ${s*.16},${s*.78} C ${s*.22},${s*.90} ${s*.44},${s*.88} ${s*.5},${s*.72} Z`
  const lowerRight = `M ${s*.5},${s*.52} C ${s*.70},${s*.55} ${s*.90},${s*.65} ${s*.84},${s*.78} C ${s*.78},${s*.90} ${s*.56},${s*.88} ${s*.5},${s*.72} Z`

  /* ── 유리 반사광 패스 (날개 안쪽 상단부, 빛이 굴절되는 영역) ── */
  const sheenUL = `M ${s*.5},${s*.30} C ${s*.41},${s*.07} ${s*.12},${s*.13} ${s*.12},${s*.34} C ${s*.14},${s*.43} ${s*.35},${s*.47} ${s*.5},${s*.41} Z`
  const sheenUR = `M ${s*.5},${s*.30} C ${s*.59},${s*.07} ${s*.88},${s*.13} ${s*.88},${s*.34} C ${s*.86},${s*.43} ${s*.65},${s*.47} ${s*.5},${s*.41} Z`
  const sheenLL = `M ${s*.5},${s*.52} C ${s*.33},${s*.55} ${s*.16},${s*.63} ${s*.20},${s*.72} C ${s*.23},${s*.80} ${s*.43},${s*.79} ${s*.5},${s*.68} Z`
  const sheenLR = `M ${s*.5},${s*.52} C ${s*.67},${s*.55} ${s*.84},${s*.63} ${s*.80},${s*.72} C ${s*.77},${s*.80} ${s*.57},${s*.79} ${s*.5},${s*.68} Z`

  const sw = s * 0.013

  return (
    <>
      <style>{`
        @keyframes bf-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes bf-flap-l {
          0%, 100% { transform: scaleX(1); }
          50%       { transform: scaleX(0.62); }
        }
        @keyframes bf-flap-r {
          0%, 100% { transform: scaleX(1); }
          50%       { transform: scaleX(0.62); }
        }
        .bf-wrap   { display: inline-block; animation: bf-float 3.5s ease-in-out infinite; }
        .bf-wing-l { transform-box: fill-box; transform-origin: 100% 50%; animation: bf-flap-l 3.2s ease-in-out infinite; }
        .bf-wing-r { transform-box: fill-box; transform-origin: 0%   50%; animation: bf-flap-r 3.2s ease-in-out infinite; }
      `}</style>

      <div className="bf-wrap" style={{ width: size, height: size }}>
        <svg
          width={size} height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            {/* 유리 그라데이션: 흰 중심 → 색상 → 어두운 테두리 */}
            <radialGradient id="g-ul" cx="32%" cy="28%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity={0.95}/>
              <stop offset="28%"  stopColor="#ddd6fe" stopOpacity={0.82}/>
              <stop offset="68%"  stopColor="#7c3aed" stopOpacity={0.72}/>
              <stop offset="100%" stopColor="#3b0764" stopOpacity={0.88}/>
            </radialGradient>
            <radialGradient id="g-ur" cx="68%" cy="28%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity={0.95}/>
              <stop offset="28%"  stopColor="#c4b5fd" stopOpacity={0.82}/>
              <stop offset="68%"  stopColor="#6d28d9" stopOpacity={0.72}/>
              <stop offset="100%" stopColor="#2e1065" stopOpacity={0.88}/>
            </radialGradient>
            <radialGradient id="g-ll" cx="32%" cy="35%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity={0.90}/>
              <stop offset="30%"  stopColor="#fecaca" stopOpacity={0.78}/>
              <stop offset="70%"  stopColor="#dc2626" stopOpacity={0.68}/>
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity={0.85}/>
            </radialGradient>
            <radialGradient id="g-lr" cx="68%" cy="35%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity={0.90}/>
              <stop offset="30%"  stopColor="#99f6e4" stopOpacity={0.78}/>
              <stop offset="70%"  stopColor="#0d9488" stopOpacity={0.68}/>
              <stop offset="100%" stopColor="#134e4a" stopOpacity={0.85}/>
            </radialGradient>

            {/* 유리 엣지 광채 필터 */}
            <filter id="glass-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>

          {/* 왼쪽 날개 그룹 */}
          <g className="bf-wing-l" filter="url(#glass-glow)">
            {/* 날개 본체 */}
            <path d={upperLeft} fill="url(#g-ul)"
              stroke="rgba(255,255,255,0.55)" strokeWidth={sw}/>
            <path d={lowerLeft} fill="url(#g-ll)"
              stroke="rgba(255,255,255,0.45)" strokeWidth={sw}/>
            {/* 유리 반사광 오버레이 */}
            <path d={sheenUL} fill="rgba(255,255,255,0.20)" style={{ pointerEvents: 'none' }}/>
            <path d={sheenLL} fill="rgba(255,255,255,0.15)" style={{ pointerEvents: 'none' }}/>
          </g>

          {/* 오른쪽 날개 그룹 */}
          <g className="bf-wing-r" filter="url(#glass-glow)">
            <path d={upperRight} fill="url(#g-ur)"
              stroke="rgba(255,255,255,0.55)" strokeWidth={sw}/>
            <path d={lowerRight} fill="url(#g-lr)"
              stroke="rgba(255,255,255,0.45)" strokeWidth={sw}/>
            <path d={sheenUR} fill="rgba(255,255,255,0.20)" style={{ pointerEvents: 'none' }}/>
            <path d={sheenLR} fill="rgba(255,255,255,0.15)" style={{ pointerEvents: 'none' }}/>
          </g>
        </svg>
      </div>
    </>
  )
}
