export default function ButterflyLogo({ size = 80 }) {
  const h = size / 2

  return (
    <>
      <style>{`
        @keyframes bf-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes bf-flap {
          0%, 100% { transform: scaleX(1); }
          50%       { transform: scaleX(0.12); }
        }
        .bf-svg  { animation: bf-float 3s ease-in-out infinite; display: block; }
        .bf-wing-l {
          transform-box: fill-box;
          transform-origin: right center;
          animation: bf-flap 1.8s ease-in-out infinite;
        }
        .bf-wing-r {
          transform-box: fill-box;
          transform-origin: left center;
          animation: bf-flap 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* 4개 쿼터-원 → 나비 날개처럼 좌우로 접힘 */}
      <svg
        className="bf-svg"
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 왼쪽 날개: 보라(위) + 주황(아래) */}
        <g className="bf-wing-l">
          <circle cx={0}    cy={0}    r={h} fill="#8B5CF6" />
          <circle cx={0}    cy={size} r={h} fill="#F97316" />
        </g>

        {/* 오른쪽 날개: 진보라(위) + 청록(아래) */}
        <g className="bf-wing-r">
          <circle cx={size} cy={0}    r={h} fill="#7C3AED" />
          <circle cx={size} cy={size} r={h} fill="#00C9A7" />
        </g>
      </svg>
    </>
  )
}
