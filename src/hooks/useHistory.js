import { useState, useCallback } from 'react'

const MAX_HISTORY = 20
const KEY = 'bf-history'

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] }
    catch { return [] }
  })

  const save = useCallback((entry) => {
    setHistory(prev => {
      const next = [{ ...entry, id: Date.now(), date: new Date().toISOString() }, ...prev].slice(0, MAX_HISTORY)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const remove = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(e => e.id !== id)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clear = useCallback(() => {
    localStorage.removeItem(KEY)
    setHistory([])
  }, [])

  const stats = {
    total: history.length,
    topClub: (() => {
      const counts = {}
      history.forEach(h => {
        const club = h.selections?.동아리
        if (club) counts[club] = (counts[club] || 0) + 1
      })
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
    })(),
  }

  return { history, save, remove, clear, stats }
}
