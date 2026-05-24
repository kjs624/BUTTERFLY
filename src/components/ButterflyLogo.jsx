export default function ButterflyLogo({ size = 80 }) {
  const s = size

  const upperLeft  = `M ${s*.5},${s*.30} C ${s*.38},${s*.03} ${s*.06},${s*.10} ${s*.08},${s*.35} C ${s*.10},${s*.55} ${s*.32},${s*.60} ${s*.5},${s*.52} Z`
  const upperRight = `M ${s*.5},${s*.30} C ${s*.62},${s*.03} ${s*.94},${s*.10} ${s*.92},${s*.35} C ${s*.90},${s*.55} ${s*.68},${s*.60} ${s*.5},${s*.52} Z`
  const lowerLeft  = `M ${s*.5},${s*.52} C ${s*.30},${s*.55} ${s*.10},${s*.65} ${s*.16},${s*.78} C ${s*.22},${s*.90} ${s*.44},${s*.88} ${s*.5},${s*.72} Z`
  const lowerRight = `M ${s*.5},${s*.52} C ${s*.70},${s*.55} ${s*.90},${s*.65} ${s*.84},${s*.78} C ${s*.78},${s*.90} ${s*.56},${s*.88} ${s*.5},${s*.72} Z`

  return (
    <>
      <style>{`
        @keyframes bf-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes bf-flap-l {
          0%, 100% { transform: scaleX(1); }
          50%       { transform: scaleX(0.55); }
        }
        @keyframes bf-flap-r {
          0%, 100% { transform: scaleX(1); }
          50%       { transform: scaleX(0.55); }
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
            <radialGradient id="g-ul" cx="40%" cy="30%">
              <stop offset="0%" stopColor="#D8B4FE"/>
              <stop offset="100%" stopColor="#7C3AED"/>
            </radialGradient>
            <radialGradient id="g-ur" cx="60%" cy="30%">
              <stop offset="0%" stopColor="#C084FC"/>
              <stop offset="100%" stopColor="#4C1D95"/>
            </radialGradient>
            <radialGradient id="g-ll" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#FCA5A5"/>
              <stop offset="100%" stopColor="#C2410C"/>
            </radialGradient>
            <radialGradient id="g-lr" cx="60%" cy="40%">
              <stop offset="0%" stopColor="#5EEAD4"/>
              <stop offset="100%" stopColor="#0E7490"/>
            </radialGradient>
          </defs>

          <g className="bf-wing-l">
            <path d={upperLeft}  fill="url(#g-ul)"/>
            <path d={lowerLeft}  fill="url(#g-ll)"/>
          </g>

          <g className="bf-wing-r">
            <path d={upperRight} fill="url(#g-ur)"/>
            <path d={lowerRight} fill="url(#g-lr)"/>
          </g>
        </svg>
      </div>
    </>
  )
}
