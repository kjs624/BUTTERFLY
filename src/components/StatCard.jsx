export default function StatCard({ label, value, unit = '', icon, color = 'var(--purple)', sub }) {
  return (
    <div className="stat-card" style={{
      background: 'var(--card-bg)', border: '1px solid var(--card-border)',
      borderRadius: 16, padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", lineHeight: 1.3 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontSize: '1.8rem', fontWeight: 700, color, fontFamily: "'DM Serif Display', serif" }}>{value}</span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontFamily: "'Noto Sans KR', sans-serif" }}>{unit}</span>
      </div>
      {sub && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>{sub}</span>}
    </div>
  )
}
