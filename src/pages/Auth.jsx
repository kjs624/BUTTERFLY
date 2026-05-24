import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ButterflyLogo from '../components/ButterflyLogo'

export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
        navigate('/my')
      } else {
        const { error } = await signUp(email, password)
        if (error) throw error
        setMessage('가입 확인 이메일을 보냈습니다. 메일함을 확인해주세요.')
      }
    } catch (err) {
      const msg = err.message || '오류가 발생했습니다.'
      if (msg.includes('Invalid login')) setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      else if (msg.includes('already registered')) setError('이미 가입된 이메일입니다.')
      else if (msg.includes('Password should')) setError('비밀번호는 6자 이상이어야 합니다.')
      else setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--bg-3)',
    border: '1px solid var(--card-border)',
    borderRadius: 12,
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    fontFamily: "'Noto Sans KR', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
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
        <div style={{
          display: 'flex', background: 'var(--bg-3)',
          borderRadius: 50, padding: 4, marginBottom: 28,
        }}>
          {[['login', '로그인'], ['signup', '회원가입']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setMode(key); setError(''); setMessage('') }}
              style={{
                flex: 1, padding: '10px', borderRadius: 50,
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: '0.9rem', fontWeight: 600,
                background: mode === key ? 'linear-gradient(135deg, var(--purple), var(--teal))' : 'transparent',
                color: mode === key ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--purple)'}
            onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
          />
          <input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--purple)'}
            onBlur={e => e.target.style.borderColor = 'var(--card-border)'}
          />

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#F87171', fontSize: '0.85rem',
              fontFamily: "'Noto Sans KR', sans-serif",
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.3)',
              color: 'var(--mint)', fontSize: '0.85rem',
              fontFamily: "'Noto Sans KR', sans-serif",
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: 4 }}
          >
            {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>

        <button
          onClick={() => navigate(-1)}
          style={{
            width: '100%', marginTop: 16, padding: '10px',
            color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: '0.85rem',
          }}
        >
          ← 돌아가기
        </button>
      </div>
    </div>
  )
}
