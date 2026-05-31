import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import Navbar from './components/Navbar'
import { TUTORIAL_KEY } from './components/Tutorial'
import Home from './pages/Home'
import Select from './pages/Select'
import Result from './pages/Result'
import Map from './pages/Map'
import My from './pages/My'
import Auth from './pages/Auth'
import AuthCallback from './pages/AuthCallback'
import CareerTest from './pages/CareerTest'
import School from './pages/School'

// 첫 방문 시 /auth로 리디렉트
function FirstVisitRedirect() {
  const navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.getItem(TUTORIAL_KEY)) {
      navigate('/auth', { replace: true })
    }
  }, [])
  return null
}

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <BrowserRouter>
      <FirstVisitRedirect />
      <Navbar theme={theme} onToggleTheme={toggle} />
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
