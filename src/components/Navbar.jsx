import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import ButterflyLogo from './ButterflyLogo'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { to: '/', label: '홈', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { to: '/select', label: '선택', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
  { to: '/school', label: '학교', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/><path d="M12 2L2 7h20L12 2z"/></svg> },
  { to: '/map', label: '지도', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg> },
  { to: '/my', label: '마이', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
]

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <path fill="#EA4335" d="M24 9.5c3.1 0 5.8 1.1 8 2.9l6-6C34.2 3.1 29.4 1 24 1 14.8 1 7 6.6 3.7 14.4l7 5.4C12.4 13.7 17.7 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-16.9z"/>
    <path fill="#FBBC05" d="M10.7 28.2A14.5 14.5 0 0 1 9.5 24c0-1.5.3-2.9.7-4.2l-7-5.4A23.8 23.8 0 0 0 .5 24c0 3.8.9 7.4 2.7 10.6l7.5-6.4z"/>
    <path fill="#34A853" d="M24 47c5.4 0 9.9-1.8 13.2-4.8l-7.4-5.7c-1.8 1.2-4.2 1.9-5.8 1.9-6.3 0-11.6-4.2-13.3-9.8l-7.5 6.4C7 41.4 14.8 47 24 47z"/>
  </svg>
)

export default function Navbar({ theme, onToggleTheme }) {
  const { user, signOut, signInWithOAuth, enabled } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const dropRef = useRef(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setOpen(false)
    await signInWithOAuth('google')
    setGoogleLoading(false)
  }

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    navigate('/')
  }

  const shortEmail = user?.email?.split('@')[0] ?? ''
  const avatarLetter = (user?.email?.[0] ?? '?').toUpperCase()

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--nav-bg)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '56px',
      }}>
        {/* Logo */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: 'var(--text-primary)' }}>
          <ButterflyLogo size={36} animate />
          <span>BUTTERFLY</span>
        </NavLink>

        {/* Desktop nav links */}
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

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {enabled && (
            <div ref={dropRef} style={{ position: 'relative' }}>
              {/* 로그인 / 유저 버튼 */}
              <button
                onClick={() => setOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: user ? '5px 12px 5px 5px' : '7px 16px',
                  borderRadius: 50, cursor: 'pointer', transition: 'all 0.2s',
                  background: user ? 'var(--card-bg)' : 'linear-gradient(135deg, var(--purple), var(--teal))',
                  border: user ? '1px solid var(--card-border)' : 'none',
                  color: user ? 'var(--text-secondary)' : '#fff',
                  fontFamily: "'Noto Sans KR', sans-serif",
                  fontSize: '0.82rem', fontWeight: 600,
                }}
              >
                {user ? (
                  <>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--purple), var(--teal))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                    }}>
                      {avatarLetter}
                    </div>
                    <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {shortEmail}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </>
                ) : (
                  googleLoading ? '로그인 중...' : '🦋 로그인'
                )}
              </button>

              {/* 드롭다운 */}
              {open && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: 220, borderRadius: 14,
                  background: 'var(--bg-2)', border: '1px solid var(--card-border)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  overflow: 'hidden', animation: 'fadeUp 0.15s ease',
                  zIndex: 300,
                }}>
                  {user ? (
                    /* 로그인 상태 */
                    <>
                      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--card-border)' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", marginBottom: 2 }}>로그인됨</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </p>
                      </div>
                      <button onClick={() => { setOpen(false); navigate('/my') }} style={menuItemStyle}>
                        📋 나의 분석 기록
                      </button>
                      <button onClick={handleSignOut} style={{ ...menuItemStyle, color: '#F87171' }}>
                        🚪 로그아웃
                      </button>
                    </>
                  ) : (
                    /* 비로그인 상태 */
                    <>
                      <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid var(--card-border)' }}>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
                          로그인하면 분석 기록이 저장됩니다
                        </p>
                      </div>
                      {/* Google 바로 로그인 */}
                      <button onClick={handleGoogleLogin} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '12px 16px',
                        background: '#fff', border: 'none', borderBottom: '1px solid var(--card-border)',
                        color: '#3c4043', fontSize: '0.88rem', fontWeight: 500,
                        fontFamily: "'Noto Sans KR', sans-serif", cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        <GoogleIcon />
                        Google로 로그인
                      </button>
                      {/* 이메일 로그인 */}
                      <button onClick={() => { setOpen(false); navigate('/auth') }} style={menuItemStyle}>
                        ✉️ 이메일로 로그인
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 테마 토글 */}
          <button onClick={onToggleTheme} style={{
            width: 40, height: 40, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
            color: 'var(--text-secondary)', fontSize: '1.1rem', cursor: 'pointer',
          }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
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

const menuItemStyle = {
  display: 'flex', alignItems: 'center', gap: 8,
  width: '100%', padding: '12px 16px',
  background: 'transparent', border: 'none',
  color: 'var(--text-secondary)', fontSize: '0.88rem',
  fontFamily: "'Noto Sans KR', sans-serif",
  cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left',
}
