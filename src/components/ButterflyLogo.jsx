export default function ButterflyLogo({ size = 80 }) {
  const r = size * 0.36
  const gap = size * 0.05
  const cx1 = size / 2 - r - gap / 2
  const cx2 = size / 2 + r + gap / 2
  const cy1 = size / 2 - r - gap / 2
  const cy2 = size / 2 + r + gap / 2

  return (
    <>
      <style>{`
        @keyframes bf-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bf-flap {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.18); }
        }
        .bf-svg { animation: bf-float 3s ease-in-out infinite; }
        .bf-left {
          transform-box: fill-box;
          transform-origin: right center;
          animation: bf-flap 1.8s ease-in-out infinite;
        }
        .bf-right {
          transform-box: fill-box;
          transform-origin: left center;
          animation: bf-flap 1.8s ease-in-out infinite;
        }
      `}</style>
      <svg className="bf-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="bf-left">
          <circle cx={cx1} cy={cy1} r={r} fill="#8B5CF6" />
          <circle cx={cx1} cy={cy2} r={r} fill="#F97316" />
        </g>
        <g className="bf-right">
          <circle cx={cx2} cy={cy1} r={r} fill="#7C3AED" />
          <circle cx={cx2} cy={cy2} r={r} fill="#00C9A7" />
        </g>
      </svg>
    </>
  )
}
