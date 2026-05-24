export default function ButterflyLogo({ size = 80 }) {
  const ur = size * 0.295   // upper wing radius
  const lr = size * 0.210   // lower wing radius (smaller)

  // Wing center positions
  const ulx = size * 0.265, uly = size * 0.315
  const urx = size * 0.735, ury = size * 0.315
  const llx = size * 0.275, lly = size * 0.710
  const lrx = size * 0.725, lry = size * 0.710

  return (
    <>
      <style>{`
        @keyframes bf-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes bf-flap-l {
          0%, 100% { transform: scaleX(1); }
          50%       { transform: scaleX(0.60); }
        }
        @keyframes bf-flap-r {
          0%, 100% { transform: scaleX(1); }
          50%       { transform: scaleX(0.60); }
        }
        .bf-wrap   { display: inline-block; animation: bf-float 3.6s ease-in-out infinite; }
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
            <radialGradient id="bf-ul" cx="38%" cy="35%">
              <stop offset="0%"   stopColor="#c4b5fd"/>
              <stop offset="100%" stopColor="#6d28d9"/>
            </radialGradient>
            <radialGradient id="bf-ur" cx="62%" cy="35%">
              <stop offset="0%"   stopColor="#5eead4"/>
              <stop offset="100%" stopColor="#0e7490"/>
            </radialGradient>
            <radialGradient id="bf-ll" cx="38%" cy="35%">
              <stop offset="0%"   stopColor="#fcd34d"/>
              <stop offset="100%" stopColor="#d97706"/>
            </radialGradient>
            <radialGradient id="bf-lr" cx="62%" cy="35%">
              <stop offset="0%"   stopColor="#6ee7b7"/>
              <stop offset="100%" stopColor="#059669"/>
            </radialGradient>
          </defs>

          {/* 왼쪽 날개 (위 + 아래) */}
          <g className="bf-wing-l">
            <ellipse cx={ulx} cy={uly} rx={ur} ry={ur * 0.93} fill="url(#bf-ul)"/>
            <ellipse cx={llx} cy={lly} rx={lr} ry={lr * 0.90} fill="url(#bf-ll)"/>
          </g>

          {/* 오른쪽 날개 (위 + 아래) */}
          <g className="bf-wing-r">
            <ellipse cx={urx} cy={ury} rx={ur} ry={ur * 0.93} fill="url(#bf-ur)"/>
            <ellipse cx={lrx} cy={lry} rx={lr} ry={lr * 0.90} fill="url(#bf-lr)"/>
          </g>
        </svg>
      </div>
    </>
  )
}
