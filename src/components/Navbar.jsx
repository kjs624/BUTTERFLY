import { NavLink, useLocation } from 'react-router-dom'
import ButterflyLogo from './ButterflyLogo'

const navItems = [
  { to: '/', label: '홈', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { to: '/select', label: '선택', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
  { to: '/map', label: '지도', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg> },
  { to: '/my', label: '마이', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
]

export default function Navbar({ theme, onToggleTheme }) {
  const location = useLocation()

  return (
    <>
      {/* Desktop top nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--nav-bg)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: '64px',
      }}>
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: 'var(--text-primary)' }}>
          <ButterflyLogo size={36} animate />
          <span>BUTTERFLY</span>
        </NavLink>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
          {navItems.slice(1).map(item => (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
              padding: '8px 18px', borderRadius: 50, fontSize: '0.9rem', fontWeight: 500,
              color: isActive ? '#fff' : 'var(--text-secondary)',
              background: isActive ? 'linear-gradient(135deg, var(--purple), var(--teal))' : 'transparent',
              transition: 'all 0.2s',
            })}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <button onClick={onToggleTheme} style={{
          width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          color: 'var(--text-secondary)', fontSize: '1.1rem', cursor: 'pointer',
        }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </nav>

      {/* Mobile bottom tab bar */}
      <div className="bottom-tab">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'active' : ''}>
            <span style={{ width: 22, height: 22 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      <style>{`
        @media (max-width: 480px) { .desktop-nav { display: none !important; } }
        @media (min-width: 481px) { .bottom-tab { display: none !important; } }
      `}</style>
    </>
  )
}
