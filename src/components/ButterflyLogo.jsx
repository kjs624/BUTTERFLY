export default function ButterflyLogo({ size = 80 }) {
  const r = size * 0.36
  const gap = size * 0.05
  const cx1 = size / 2 - r - gap / 2
  const cx2 = size / 2 + r + gap / 2
  const cy1 = size / 2 - r - gap / 2
  const cy2 = size / 2 + r + gap / 2

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx={cx1} cy={cy1} r={r} fill="#8B5CF6" />
      <circle cx={cx2} cy={cy1} r={r} fill="#7C3AED" />
      <circle cx={cx1} cy={cy2} r={r} fill="#F97316" />
      <circle cx={cx2} cy={cy2} r={r} fill="#00C9A7" />
    </svg>
  )
}
