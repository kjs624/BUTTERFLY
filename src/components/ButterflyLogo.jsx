export default function ButterflyLogo({ size = 80 }) {
  const cx = size / 2
  const rx = size * 0.46   // 날개 가로 반경
  const ry = size * 0.28   // 날개 세로 반경

  return (
    <>
      <style>{`
        @keyframes bf-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes bf-flap-l {
          0%, 100% { transform: rotateY(0deg); }
          50%       { transform: rotateY(70deg); }
        }
        @keyframes bf-flap-r {
          0%, 100% { transform: rotateY(0deg); }
          50%       { transform: rotateY(-70deg); }
        }
        .bf-wrap  { display: inline-block; animation: bf-float 3s ease-in-out infinite; }
        .bf-wing-l { transform-style: preserve-3d; transform-origin: right center; animation: bf-flap-l 1.8s ease-in-out infinite; }
        .bf-wing-r { transform-style: preserve-3d; transform-origin: left center; animation: bf-flap-r 1.8s ease-in-out infinite; }
      `}</style>

      <div className="bf-wrap" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* 왼쪽 날개 위 */}
          <g className="bf-wing-l">
            <ellipse
              cx={cx * 0.52} cy={cx * 0.75}
              rx={rx} ry={ry}
              fill="url(#grad-tl)"
              transform={`rotate(-25, ${cx * 0.52}, ${cx * 0.75})`}
              opacity={0.92}
            />
            {/* 왼쪽 날개 아래 */}
            <ellipse
              cx={cx * 0.56} cy={cx * 1.38}
              rx={rx * 0.82} ry={ry * 0.78}
              fill="url(#grad-bl)"
              transform={`rotate(20, ${cx * 0.56}, ${cx * 1.38})`}
              opacity={0.88}
            />
          </g>

          {/* 오른쪽 날개 위 */}
          <g className="bf-wing-r">
            <ellipse
              cx={cx * 1.48} cy={cx * 0.75}
              rx={rx} ry={ry}
              fill="url(#grad-tr)"
              transform={`rotate(25, ${cx * 1.48}, ${cx * 0.75})`}
              opacity={0.92}
            />
            {/* 오른쪽 날개 아래 */}
            <ellipse
              cx={cx * 1.44} cy={cx * 1.38}
              rx={rx * 0.82} ry={ry * 0.78}
              fill="url(#grad-br)"
              transform={`rotate(-20, ${cx * 1.44}, ${cx * 1.38})`}
              opacity={0.88}
            />
          </g>

          {/* 몸통 */}
          <ellipse cx={cx} cy={cx} rx={cx * 0.08} ry={cx * 0.5} fill="#1a0a3d" opacity={0.7}/>

          {/* 더듬이 */}
          <line x1={cx} y1={cx * 0.5} x2={cx * 0.7} y2={cx * 0.1} stroke="#8B5CF6" strokeWidth={cx * 0.06} strokeLinecap="round" opacity={0.7}/>
          <line x1={cx} y1={cx * 0.5} x2={cx * 1.3} y2={cx * 0.1} stroke="#8B5CF6" strokeWidth={cx * 0.06} strokeLinecap="round" opacity={0.7}/>
          <circle cx={cx * 0.68} cy={cx * 0.08} r={cx * 0.07} fill="#A855F7"/>
          <circle cx={cx * 1.32} cy={cx * 0.08} r={cx * 0.07} fill="#A855F7"/>

          {/* 그라디언트 정의 */}
          <defs>
            <radialGradient id="grad-tl" cx="60%" cy="50%">
              <stop offset="0%" stopColor="#A855F7"/>
              <stop offset="100%" stopColor="#6D28D9"/>
            </radialGradient>
            <radialGradient id="grad-bl" cx="60%" cy="40%">
              <stop offset="0%" stopColor="#F97316"/>
              <stop offset="100%" stopColor="#C2410C"/>
            </radialGradient>
            <radialGradient id="grad-tr" cx="40%" cy="50%">
              <stop offset="0%" stopColor="#7C3AED"/>
              <stop offset="100%" stopColor="#4C1D95"/>
            </radialGradient>
            <radialGradient id="grad-br" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#00C9A7"/>
              <stop offset="100%" stopColor="#0891B2"/>
            </radialGradient>
          </defs>
        </svg>
      </div>
    </>
  )
}
