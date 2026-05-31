import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Tutorial, { TUTORIAL_KEY } from './components/Tutorial'
import ButterflyLogo from './components/ButterflyLogo'
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
const PUBLIC_PATHS = ['/auth', '/school', '/map', '/select', '/result']

function AuthGuard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loading) return
    const isGuest = !!sessionStorage.getItem('butterfly_guest')
    const isPublic = PUBLIC_PATHS.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))
    const guestBlocked = isGuest && (location.pathname === '/my' || location.pathname.startsWith('/career-test'))
    if (!user && !isPublic && !isGuest) {
      navigate('/auth', { replace: true })
    } else if (guestBlocked) {
      navigate('/auth', { replace: true })
    }
  }, [user, loading, location.pathname])

  return null
}

// 홈(/) 진입 시 스플래시 전환 애니메이션
function HomeTransition() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)
  const location = useLocation()
  const prevPath = useRef(null)

  useEffect(() => {
    if (location.pathname === '/' && prevPath.current !== null && prevPath.current !== '/') {
      setVisible(true)
      setFading(false)
      const t1 = setTimeout(() => setFading(true), 900)
      const t2 = setTimeout(() => setVisible(false), 1400)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
    prevPath.current = location.pathname
  }, [location.pathname])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: 'var(--bg-1)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.5s ease',
      pointerEvents: 'none',
    }}>
      <div style={{ animation: 'float 1.5s ease-in-out infinite' }}>
        <ButterflyLogo size={72} animate />
      </div>
      <h1 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: '2.4rem', letterSpacing: '0.06em',
        animation: 'fadeUp 0.5s ease',
      }}>
        BUTTERFLY
      </h1>
    </div>
  )
}

// 홈(/)에서 튜토리얼 표시
// - 일반 사용자: localStorage 키 없으면 표시
// - 비회원(게스트): 세션당 1회 표시 (sessionStorage 키로 관리)
function TutorialManager() {
  const [show, setShow] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/') return

    const isGuest = !!sessionStorage.getItem('butterfly_guest')
    const tutorialSeen = !!localStorage.getItem(TUTORIAL_KEY)
    const guestTutorialShown = !!sessionStorage.getItem('butterfly_guest_tutorial')

    if (!tutorialSeen || (isGuest && !guestTutorialShown)) {
      // 전환 애니메이션 이후 튜토리얼 표시
      const delay = isGuest ? 1300 : 0
      const t = setTimeout(() => setShow(true), delay)
      return () => clearTimeout(t)
    }
  }, [location.pathname])

  const handleClose = () => {
    sessionStorage.setItem('butterfly_guest_tutorial', 'true')
    setShow(false)
  }

  if (!show) return null
  return <Tutorial onClose={handleClose} />
}

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <BrowserRouter>
      <AuthGuard />
      <HomeTransition />
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
