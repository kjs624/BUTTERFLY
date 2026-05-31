import { useState, useEffect } from 'react'
import { supabase, supabaseEnabled } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabaseEnabled) { setLoading(false); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      // 자동 로그인 OFF 상태에서 브라우저 재시작 감지 → 자동 로그아웃
      if (
        session &&
        localStorage.getItem('butterfly_auto_login') === 'false' &&
        !sessionStorage.getItem('butterfly_session_active')
      ) {
        supabase.auth.signOut()
        setUser(null)
      } else {
        setUser(session?.user ?? null)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password })

  const signOut = () => supabase.auth.signOut()

  const signInWithOAuth = (provider) =>
    supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })

  return { user, loading, signIn, signUp, signOut, signInWithOAuth, enabled: supabaseEnabled }
}
