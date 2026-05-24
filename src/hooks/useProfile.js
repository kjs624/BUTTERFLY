import { useState, useEffect } from 'react'
import { supabase, supabaseEnabled } from '../lib/supabase'

const LOCAL_KEY = 'butterfly_profile'

const EMPTY = {
  school: '', desired_major: '', career_goal: '',
  age: '', gender: '', grades: '', strengths: '', weaknesses: '',
}

export function useProfile(user) {
  const [profile, setProfile] = useState(EMPTY)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (supabaseEnabled && user) {
      loadFromSupabase(user.id)
    } else {
      const raw = localStorage.getItem(LOCAL_KEY)
      if (raw) {
        try { setProfile({ ...EMPTY, ...JSON.parse(raw) }) } catch {}
      }
    }
  }, [user])

  async function loadFromSupabase(userId) {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (data) setProfile({ ...EMPTY, ...data })
    setLoading(false)
  }

  async function save(updates) {
    const next = { ...profile, ...updates }
    setProfile(next)

    if (supabaseEnabled && user) {
      await supabase.from('profiles').upsert({
        user_id: user.id,
        ...next,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
    }
  }

  return { profile, save, loading }
}
