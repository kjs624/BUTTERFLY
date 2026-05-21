import { useEffect, useRef } from 'react'

export default function ButterflyLogo({ size = 80, animate = true, color = '#A855F7' }) {
  const leftWingRef = useRef(null)
  const rightWingRef = useRef(null)

  useEffect(() => {
    if (!animate) return
    let frame
    let t = 0
    const tick = () => {
      t += 0.04
      const scale = 0.55 + Math.abs(Math.sin(t)) * 0.45
      if (leftWingRef.current) leftWingRef.current.setAttribute('transform', `scale(${scale}, 1) translate(0,0)`)
      if (rightWingRef.current) rightWingRef.current.setAttribute('transform', `scale(${-scale}, 1) translate(${-size}, 0)`)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [animate, size])

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="wl" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0891B2" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id="wr" cx="60%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#00C9A7" stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </radialGradient>
      </defs>
      {/* Left wing */}
      <g ref={leftWingRef} style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}>
        <path
          d={`M${size/2},${size/2} Q${size*0.15},${size*0.1} ${size*0.05},${size*0.4} Q${size*0.1},${size*0.7} ${size/2},${size*0.6} Z`}
          fill="url(#wl)"
          opacity="0.85"
        />
        <path
          d={`M${size/2},${size/2} Q${size*0.2},${size*0.55} ${size*0.08},${size*0.8} Q${size*0.2},${size*0.9} ${size/2},${size*0.72} Z`}
          fill="url(#wl)"
          opacity="0.6"
        />
      </g>
      {/* Right wing */}
      <g ref={rightWingRef} style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}>
        <path
          d={`M${size/2},${size/2} Q${size*0.85},${size*0.1} ${size*0.95},${size*0.4} Q${size*0.9},${size*0.7} ${size/2},${size*0.6} Z`}
          fill="url(#wr)"
          opacity="0.85"
        />
        <path
          d={`M${size/2},${size/2} Q${size*0.8},${size*0.55} ${size*0.92},${size*0.8} Q${size*0.8},${size*0.9} ${size/2},${size*0.72} Z`}
          fill="url(#wr)"
          opacity="0.6"
        />
      </g>
      {/* Body */}
      <ellipse cx={size/2} cy={size/2} rx={size*0.04} ry={size*0.22} fill={color} opacity="0.9" />
      <circle cx={size/2} cy={size*0.28} r={size*0.05} fill={color} />
      {/* Antennae */}
      <line x1={size/2} y1={size*0.23} x2={size*0.38} y2={size*0.08} stroke={color} strokeWidth="1.5" opacity="0.7" />
      <line x1={size/2} y1={size*0.23} x2={size*0.62} y2={size*0.08} stroke={color} strokeWidth="1.5" opacity="0.7" />
      <circle cx={size*0.38} cy={size*0.07} r={size*0.025} fill={color} />
      <circle cx={size*0.62} cy={size*0.07} r={size*0.025} fill={color} />
    </svg>
  )
}
