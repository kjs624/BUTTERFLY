import { useEffect } from 'react'

export default function CareerResultViewer({ url, versionName, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!url) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeUp 0.2s ease', padding: 20,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--bg-1)', borderRadius: 24,
        border: '1px solid var(--card-border)',
        padding: '40px 36px', maxWidth: 420, width: '100%',
        textAlign: 'center', position: 'relative',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        animation: 'fadeUp 0.25s ease',
      }}>
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'var(--bg-3)', color: 'var(--text-muted)', fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* 성공 아이콘 */}
        <div style={{ fontSize: '3.5rem', marginBottom: 20 }}>🎉</div>

        {/* 제목 */}
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: '1.4rem', marginBottom: 10, color: 'var(--text-primary)',
        }}>
          검사 완료!
        </h2>

        <p style={{
          fontFamily: "'Noto Sans KR', sans-serif",
          fontSize: '0.9rem', color: 'var(--text-secondary)',
          lineHeight: 1.7, marginBottom: 8,
        }}>
          <strong style={{ color: 'var(--purple-light)' }}>{versionName || '진로 심리 검사'}</strong> 결과가<br />
          커리어넷 서버에 저장되었어요.
        </p>

        <p style={{
          fontFamily: "'Noto Sans KR', sans-serif",
          fontSize: '0.82rem', color: 'var(--text-muted)',
          marginBottom: 28, lineHeight: 1.6,
        }}>
          보안 정책으로 앱 내 직접 표시가 제한됩니다.<br />
          아래 버튼으로 결과를 확인하세요.
        </p>

        {/* 메인 버튼 — 새 탭으로 */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block', width: '100%', padding: '15px 24px',
            borderRadius: 14, fontSize: '1rem', fontWeight: 700,
            fontFamily: "'Noto Sans KR', sans-serif", textDecoration: 'none',
            background: 'linear-gradient(135deg, var(--purple), var(--teal))',
            color: '#fff', boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
            boxSizing: 'border-box', marginBottom: 12,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          📊 커리어넷에서 결과 보기 ↗
        </a>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '11px', borderRadius: 12, cursor: 'pointer',
            fontFamily: "'Noto Sans KR', sans-serif", fontSize: '0.88rem',
            background: 'var(--bg-3)', border: '1px solid var(--card-border)',
            color: 'var(--text-muted)',
          }}
        >
          닫기 (ESC)
        </button>
      </div>
    </div>
  )
}
