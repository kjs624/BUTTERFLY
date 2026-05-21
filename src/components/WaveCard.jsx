export default function WaveCard({ step, label, color, icon, children, delay = 0 }) {
  const colors = {
    short: { bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.3)', accent: '#A855F7' },
    mid:   { bg: 'rgba(8,145,178,0.12)',  border: 'rgba(8,145,178,0.3)',  accent: '#0891B2' },
    long:  { bg: 'rgba(0,201,167,0.12)',  border: 'rgba(0,201,167,0.3)',  accent: '#00C9A7' },
  }
  const c = colors[step] || colors.short

  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 20, padding: '24px 28px',
      animation: `fadeUp 0.5s ease ${delay}s both`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 120, height: 120, borderRadius: '50%',
        background: c.border, opacity: 0.3,
        filter: 'blur(30px)',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: '1.4rem' }}>{icon}</span>
        <span style={{
          background: c.accent, color: '#fff',
          padding: '3px 12px', borderRadius: 50,
          fontSize: '0.75rem', fontWeight: 700,
          fontFamily: "'Noto Sans KR', sans-serif",
        }}>{label}</span>
      </div>
      <div style={{ color: 'var(--text-primary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
        {children}
      </div>
    </div>
  )
}
