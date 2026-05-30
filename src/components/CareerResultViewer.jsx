import { useState, useRef, useEffect } from 'react'

export default function CareerResultViewer({ url, versionName, onClose }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const iframeRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!url) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
      display: 'flex', flexDirection: 'column',
      animation: 'fadeUp 0.2s ease',
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 20px', background: 'var(--bg-1)',
        borderBottom: '1px solid var(--card-border)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.2rem' }}>📊</span>
          <div>
            <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {versionName || '진로 심리 검사'} 결과
            </p>
            <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              커리어넷 공식 결과
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '7px 14px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 600,
              fontFamily: "'Noto Sans KR', sans-serif", textDecoration: 'none',
              background: 'linear-gradient(135deg, var(--purple), var(--teal))',
              color: '#fff', whiteSpace: 'nowrap',
            }}
          >
            새 탭으로 열기 ↗
          </a>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'var(--bg-3)', color: 'var(--text-muted)', fontSize: '1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* 결과 iframe */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {!loaded && !error && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-1)', gap: 16,
          }}>
            <div style={{ fontSize: '2.5rem', animation: 'pulse 1.5s infinite' }}>🦋</div>
            <p style={{ fontFamily: "'Noto Sans KR', sans-serif", color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              결과를 불러오는 중...
            </p>
          </div>
        )}

        {error && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-1)', gap: 16, padding: 32,
          }}>
            <div style={{ fontSize: '3rem' }}>⚠️</div>
            <p style={{ fontFamily: "'Noto Sans KR', sans-serif", color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.7 }}>
              결과 페이지를 앱 내에서 불러올 수 없습니다.<br />
              아래 버튼을 눌러 외부 브라우저에서 확인하세요.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '12px 28px', borderRadius: 14, fontSize: '0.95rem', fontWeight: 700,
                fontFamily: "'Noto Sans KR', sans-serif", textDecoration: 'none',
                background: 'linear-gradient(135deg, var(--purple), var(--teal))', color: '#fff',
              }}
            >
              커리어넷에서 결과 보기 →
            </a>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={url}
          style={{
            width: '100%', height: '100%', border: 'none',
            opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease',
          }}
          title="진로 심리 검사 결과"
          onLoad={() => {
            try {
              // 같은 도메인이면 접근 가능, 다른 도메인이면 SecurityError
              const doc = iframeRef.current?.contentDocument
              if (!doc || !doc.body || doc.body.innerHTML.trim() === '') {
                setError(true)
              } else {
                setLoaded(true)
              }
            } catch {
              // cross-origin이지만 로드는 됨 (X-Frame-Options 없음)
              setLoaded(true)
            }
          }}
          onError={() => setError(true)}
        />
      </div>

      {/* ESC 안내 */}
      <div style={{
        padding: '8px 20px', background: 'var(--bg-1)',
        borderTop: '1px solid var(--card-border)', flexShrink: 0,
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans KR', sans-serif" }}>
          ESC 또는 ✕ 버튼으로 닫기
        </p>
      </div>
    </div>
  )
}
