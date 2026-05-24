export default function WaveCard({ step, label, icon, children, delay = 0 }) {
  const colors = {
    short: { bg: 'rgba(124,58,237,0.10)', border: 'rgba(124,58,237,0.28)', accent: '#A855F7', glow: 'rgba(124,58,237,0.15)' },
    mid:   { bg: 'rgba(8,145,178,0.10)',  border: 'rgba(8,145,178,0.28)',  accent: '#0891B2', glow: 'rgba(8,145,178,0.15)' },
    long:  { bg: 'rgba(0,201,167,0.10)',  border: 'rgba(0,201,167,0.28)',  accent: '#00C9A7', glow: 'rgba(0,201,167,0.15)' },
  }
  const c = colors[step] || colors.short

  const lines = typeof children === 'string'
    ? children.split('\n').map(l => l.trim()).filter(Boolean)
    : children ? [children] : []

  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 20,
      padding: '28px 32px',
      animation: `fadeUp 0.5s ease ${delay}s both`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* glow blob */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 160, height: 160, borderRadius: '50%',
        background: c.glow, filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        <span style={{
          background: c.accent, color: '#fff',
          padding: '4px 14px', borderRadius: 50,
          fontSize: '0.78rem', fontWeight: 700,
          fontFamily: "'Noto Sans KR', sans-serif",
          letterSpacing: '0.03em',
        }}>
          {label}
        </span>
      </div>

      {/* content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {lines.length === 0 ? (
          <p style={{
            color: 'var(--text-muted)',
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: '0.9rem',
          }}>내용을 불러오는 중...</p>
        ) : (
          lines.map((line, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              marginBottom: i < lines.length - 1 ? 12 : 0,
            }}>
              <span style={{
                flexShrink: 0,
                width: 6, height: 6,
                borderRadius: '50%',
                background: c.accent,
                marginTop: 8,
                opacity: 0.8,
              }} />
              <p style={{
                color: 'var(--text-primary)',
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: '0.95rem',
                lineHeight: 1.75,
                margin: 0,
              }}>
                {line}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
