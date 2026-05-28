import { useState, useEffect } from 'react'

const STORAGE_KEY = 'butterfly_career_results'

export function useCareerTest(user) {
  const [results, setResults] = useState({})

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { setResults(JSON.parse(saved)) }
      catch { setResults({}) }
    }
  }, [])

  function saveResult(version, data) {
    const updated = {
      ...results,
      [version]: { ...data, date: new Date().toISOString() },
    }
    setResults(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  function clearResult(version) {
    const updated = { ...results }
    if (version !== undefined) delete updated[version]
    else Object.keys(updated).forEach(k => delete updated[k])
    setResults(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return { results, saveResult, clearResult }
}
