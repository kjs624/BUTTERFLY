export default function StatCard({ label, value, unit = '', icon, color = 'var(--purple)', sub }) {
  return (
    <div style={{
      background: 'var(--card-bg)', border: '1px solid var(--card-border)',
      borderRadius: 16, padding: '20px 24px',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '1.3rem' }}>{icon}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: '2rem', fontWeight: 700, color, fontFamily: "'DM Serif Display', serif" }}>{value}</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: "'Noto Sans KR', sans-serif" }}>{unit}</span>
      </div>
      {sub && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>{sub}</span>}
    </div>
  )
}
