import { useState } from 'react'

export function useAnalyze() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const analyze = async (selections, mode = 'full', focusArea = null) => {
    setLoading(true)
    setError(null)
    try {
      const base = import.meta.env.VITE_API_BASE_URL || ''
      const res = await fetch(`${base}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections, mode, focusArea }),
      })
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`)
      const data = await res.json()
      setResult(data)
      return data
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { analyze, loading, error, result, setResult }
}
