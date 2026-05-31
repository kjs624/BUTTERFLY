import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Tutorial, { TUTORIAL_KEY } from './components/Tutorial'

// 홈(/)에서만 튜토리얼 표시
function TutorialManager() {
  const [show, setShow] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/' && !localStorage.getItem(TUTORIAL_KEY)) {
      setShow(true)
    }
  }, [location.pathname])

  if (!show) return null
  return <Tutorial onClose={() => setShow(false)} />
}
import Home from './pages/Home'
import Select from './pages/Select'
import Result from './pages/Result'
import Map from './pages/Map'
import My from './pages/My'
import Auth from './pages/Auth'
import AuthCallback from './pages/AuthCallback'
import CareerTest from './pages/CareerTest'
import School from './pages/School'

// 비로그인 시 /auth로 리디렉트 (공개 경로 제외)
const PUBLIC_PATHS = ['/auth', '/career-test', '/school', '/map', '/select', '/result']

function AuthGuard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loading) return
    const isGuest = !!sessionStorage.getItem('butterfly_guest')
    const isPublic = PUBLIC_PATHS.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))
    // 비회원(게스트)은 /my 제외 모든 경로 허용
    const guestBlocked = isGuest && location.pathname === '/my'
    if (!user && !isPublic && !isGuest) {
      navigate('/auth', { replace: true })
    } else if (guestBlocked) {
      navigate('/auth', { replace: true })
    }
  }, [user, loading, location.pathname])

  return null
}

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <BrowserRouter>
      <AuthGuard />
      <TutorialManager />
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
