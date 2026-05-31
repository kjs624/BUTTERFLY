import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ButterflyLogo from '../components/ButterflyLogo'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.1 0 5.8 1.1 8 2.9l6-6C34.2 3.1 29.4 1 24 1 14.8 1 7 6.6 3.7 14.4l7 5.4C12.4 13.7 17.7 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-16.9z"/>
    <path fill="#FBBC05" d="M10.7 28.2A14.5 14.5 0 0 1 9.5 24c0-1.5.3-2.9.7-4.2l-7-5.4A23.8 23.8 0 0 0 .5 24c0 3.8.9 7.4 2.7 10.6l7.5-6.4z"/>
    <path fill="#34A853" d="M24 47c5.4 0 9.9-1.8 13.2-4.8l-7.4-5.7c-1.8 1.2-4.2 1.9-5.8 1.9-6.3 0-11.6-4.2-13.3-9.8l-7.5 6.4C7 41.4 14.8 47 24 47z"/>
  </svg>
)


export default function Auth() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState('')
  const [autoLogin, setAutoLogin] = useState(true)
  const { signIn, signUp, signInWithOAuth } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setMessage(''); setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
        // 자동 로그인 설정 저장
        localStorage.setItem('butterfly_auto_login', autoLogin ? 'true' : 'false')
        if (!autoLogin) sessionStorage.setItem('butterfly_session_active', 'true')
        // 첫 로그인(튜토리얼 미확인)이면 메인으로, 재방문이면 마이페이지로
        navigate(localStorage.getItem('butterfly_tutorial_seen') ? '/my' : '/')
      } else {
        const { data, error } = await signUp(email, password)

        // 이메일 발송 한도 초과 → 이미 계정이 있을 수 있으므로 로그인 시도
        if (error && error.message?.toLowerCase().includes('email rate limit')) {
          const { error: loginErr } = await signIn(email, password)
          if (loginErr) {
            setError('이메일 인증 한도를 초과했습니다. 잠시 후 다시 시도해주세요.')
            setLoading(false)
            return
          }
          localStorage.setItem('butterfly_auto_login', 'true')
          sessionStorage.setItem('butterfly_session_active', 'true')
          navigate('/career-test?new=true')
          return
        }

        if (error) throw error

        // 가입 후 세션이 없으면 자동 로그인
        if (!data.session) {
          const { error: loginErr } = await signIn(email, password)
          if (loginErr) throw loginErr
        }
        localStorage.setItem('butterfly_auto_login', 'true')
        sessionStorage.setItem('butterfly_session_active', 'true')
        navigate('/career-test?new=true')
      }
    } catch (err) {
      const msg = (err.message || '').toString()
      const isEmptyErr = !msg || msg === '{}' || msg === 'undefined'
      if (msg.includes('Invalid login')) setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      else if (msg.includes('already registered')) setError('이미 가입된 이메일입니다. 로그인 탭을 이용해주세요.')
      else if (msg.includes('Password should')) setError('비밀번호는 6자 이상이어야 합니다.')
      else if (msg.toLowerCase().includes('rate limit') || isEmptyErr) setError('이메일 발송 한도 초과입니다. 잠시 후 다시 시도하거나 Google로 가입해주세요.')
      else setError(msg || '오류가 발생했습니다.')
    } finally { setLoading(false) }
  }

  const handleOAuth = async (provider) => {
    setOauthLoading(provider); setError('')
    try {
      const { error } = await signInWithOAuth(provider)
      if (error) throw error
      // 리다이렉트되므로 이 이후 코드는 실행 안 됨
    } catch (err) {
      setError(`${provider} 로그인 오류: ${err.message}`)
      setOauthLoading('')
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'var(--bg-3)', border: '1px solid var(--card-border)',
    borderRadius: 12, color: 'var(--text-primary)',
    fontSize: '0.95rem', fontFamily: "'Noto Sans KR', sans-serif",
    outline: 'none', transition: 'border-color 0.2s',
  }

  return (
    <>
    <div className="page" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', minHeight: '100vh',
    }}>
      <div style={{ width: '100%', maxWidth: 420, animation: 'fadeUp 0.4s ease' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <ButterflyLogo size={56} animate />
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', marginTop: 12 }}>
            BUTTERFLY
          </h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", marginTop: 4, fontSize: '0.9rem' }}>
            학교에서의 선택이 만드는 나비효과
          </p>
        </div>

        {/* Tab */}
        <div style={{ display: 'flex', background: 'var(--bg-3)', borderRadius: 50, padding: 4, marginBottom: 28 }}>
          {[['login', '로그인'], ['signup', '회원가입']].map(([key, label]) => (
            <button key={key} onClick={() => { setMode(key); setError(''); setMessage('') }} style={{
              flex: 1, padding: '10px', borderRadius: 50,
              fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem', fontWeight: 600,
              background: mode === key ? 'linear-gradient(135deg, var(--purple), var(--teal))' : 'transparent',
              color: mode === key ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Social Login */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {/* Google */}
          <button
            onClick={() => handleOAuth('google')}
            disabled={!!oauthLoading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '13px', borderRadius: 12,
              background: '#fff', border: '1px solid #dadce0',
              color: '#3c4043', fontSize: '0.95rem', fontWeight: 500,
              fontFamily: "'Noto Sans KR', sans-serif",
              cursor: oauthLoading ? 'not-allowed' : 'pointer',
              opacity: oauthLoading && oauthLoading !== 'google' ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => !oauthLoading && (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            {oauthLoading === 'google' ? '처리 중...' : <><GoogleIcon /> Google로 계속하기</>}
          </button>

        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--card-border)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: "'Noto Sans KR', sans-serif", whiteSpace: 'nowrap' }}>
            또는 이메일로 계속하기
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--card-border)' }} />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="email" placeholder="이메일" value={email}
            onChange={e => setEmail(e.target.value)} required style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--purple)'}
            onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
          />
          <input
            type="password" placeholder="비밀번호 (6자 이상)" value={password}
            onChange={e => setPassword(e.target.value)} required style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--purple)'}
            onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
          />

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#F87171', fontSize: '0.85rem', fontFamily: "'Noto Sans KR', sans-serif",
            }}>{error}</div>
          )}
          {message && (
            <div style={{
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.3)',
              color: 'var(--mint)', fontSize: '0.85rem', fontFamily: "'Noto Sans KR', sans-serif",
            }}>{message}</div>
          )}

          {mode === 'login' && (
            <label style={{
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.85rem',
              color: 'var(--text-secondary)', userSelect: 'none',
            }}>
              <input
                type="checkbox"
                checked={autoLogin}
                onChange={e => setAutoLogin(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--purple)', cursor: 'pointer' }}
              />
              자동 로그인
            </label>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 4 }}>
            {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>

        {/* 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--card-border)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: "'Noto Sans KR', sans-serif", whiteSpace: 'nowrap' }}>
            또는
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--card-border)' }} />
        </div>

        {/* 비회원으로 시작 */}
        <button
          onClick={() => { sessionStorage.setItem('butterfly_guest', 'true'); navigate('/') }}
          style={{
            width: '100%', padding: '13px', borderRadius: 12,
            fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.9rem', fontWeight: 600,
            background: 'transparent', border: '1.5px dashed var(--card-border)',
            color: 'var(--text-muted)', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.color = 'var(--purple-light)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          비회원으로 시작하기
        </button>

        <button onClick={() => navigate(-1)} style={{
          width: '100%', marginTop: 10, padding: '8px',
          color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.82rem',
          background: 'none', border: 'none', cursor: 'pointer',
        }}>
          ← 돌아가기
        </button>
      </div>
    </div>
    </>
  )
}
