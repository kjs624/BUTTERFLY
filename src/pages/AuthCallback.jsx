import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ButterflyLogo from '../components/ButterflyLogo'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe()
        navigate('/my', { replace: true })
      } else if (event === 'SIGNED_OUT') {
        navigate('/auth', { replace: true })
      }
    })

    // fallback: 2초 후 세션 재확인
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) navigate('/my', { replace: true })
      else navigate('/auth', { replace: true })
    }, 2000)

    return () => { subscription.unsubscribe(); clearTimeout(timer) }
  }, [navigate])

  return (
    <div className="page" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
    }}>
      <ButterflyLogo size={60} animate />
      <p style={{ color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
        로그인 처리 중...
      </p>
    </div>
  )
}
