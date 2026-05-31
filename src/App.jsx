import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import Navbar from './components/Navbar'
import Tutorial, { TUTORIAL_KEY } from './components/Tutorial'
import Home from './pages/Home'
import Select from './pages/Select'
import Result from './pages/Result'
import Map from './pages/Map'
import My from './pages/My'
import Auth from './pages/Auth'
import AuthCallback from './pages/AuthCallback'
import CareerTest from './pages/CareerTest'
import School from './pages/School'

export default function App() {
  const { theme, toggle } = useTheme()
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(TUTORIAL_KEY)) {
      setShowTutorial(true)
    }
  }, [])

  return (
    <BrowserRouter>
      <Navbar theme={theme} onToggleTheme={toggle} />
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select" element={<Select />} />
        <Route path="/result" element={<Result />} />
        <Route path="/map" element={<Map />} />
        <Route path="/my" element={<My />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/career-test" element={<CareerTest />} />
        <Route path="/school" element={<School />} />
      </Routes>
    </BrowserRouter>
  )
}
