import { useState, useEffect, useCallback } from 'react'
import { supabase, supabaseEnabled } from '../lib/supabase'

const LOCAL_KEY = 'bf-history'
const MAX = 20

function getUser() {
  if (!supabaseEnabled) return null
  return supabase.auth.getUser().then(({ data }) => data.user)
}

export function useHistory() {
  const [history, setHistory] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!supabaseEnabled) {
      loadLocal()
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) loadSupabase()
      else loadLocal()
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) loadSupabase()
      else loadLocal()
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadLocal = () => {
    try { setHistory(JSON.parse(localStorage.getItem(LOCAL_KEY)) || []) }
    catch { setHistory([]) }
  }

  const loadSupabase = async () => {
    const { data } = await supabase
      .from('analyses')
      .select('id, created_at, selections, result')
      .order('created_at', { ascending: false })
      .limit(MAX)
    if (data) setHistory(data.map(r => ({ id: r.id, date: r.created_at, selections: r.selections, result: r.result })))
  }

  // save → returns analysisId (string for Supabase, number for local)
  const save = useCallback(async (entry) => {
    if (supabaseEnabled && user) {
      const { data, error } = await supabase
        .from('analyses')
        .insert({ user_id: user.id, selections: entry.selections, result: entry.result })
        .select('id, created_at')
        .single()
      if (data) {
        setHistory(prev => [{ id: data.id, date: data.created_at, ...entry }, ...prev].slice(0, MAX))
        return data.id
      }
      if (error) console.error('save error:', error)
      return null
    }
    // localStorage fallback
    const id = Date.now()
    const item = { ...entry, id, date: new Date().toISOString() }
    setHistory(prev => {
      const next = [item, ...prev].slice(0, MAX)
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
      return next
    })
    return id
  }, [user])

  const remove = useCallback(async (id) => {
    if (supabaseEnabled && user) {
      await supabase.from('analyses').delete().eq('id', id)
    } else {
      setHistory(prev => {
        const next = prev.filter(e => e.id !== id)
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
        return next
      })
    }
    setHistory(prev => prev.filter(e => e.id !== id))
  }, [user])

  const clear = useCallback(async () => {
    if (supabaseEnabled && user) {
      await supabase.from('analyses').delete().eq('user_id', user.id)
    } else {
      localStorage.removeItem(LOCAL_KEY)
    }
    setHistory([])
  }, [user])

  const stats = {
    total: history.length,
    topClub: (() => {
      const counts = {}
      history.forEach(h => {
        const c = h.selections?.동아리
        if (c) counts[c] = (counts[c] || 0) + 1
      })
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]?.slice(0, 10) || '—'
    })(),
  }

  return { history, save, remove, clear, stats, user }
}
