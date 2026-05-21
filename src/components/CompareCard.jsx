import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function encodeResult(data) {
  try { return btoa(encodeURIComponent(JSON.stringify(data))) } catch { return '' }
}
function decodeResult(str) {
  try { return JSON.parse(decodeURIComponent(atob(str))) } catch { return null }
}

export default function CompareCard({ myResult, mySelections }) {
  const [searchParams] = useSearchParams()
  const [friendResult, setFriendResult] = useState(null)
  const [shareLink, setShareLink] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const encoded = searchParams.get('share')
    if (encoded) setFriendResult(decodeResult(encoded))
  }, [searchParams])

  const generateLink = () => {
    const encoded = encodeResult({ result: myResult, selections: mySelections })
    const url = `${window.location.origin}/result?share=${encoded}`
    setShareLink(url)
    navigator.clipboard?.writeText(url).catch(() => {})
  }

  const fields = [
    { key: 'stat1', label: '만족도 변화' },
    { key: 'stat2', label: '진로 연결률' },
    { key: 'stat3', label: '핵심 수치' },
  ]

  return (
    <div>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', marginBottom: 8 }}>
        👥 친구 비교 나비효과
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24, fontFamily: "'Noto Sans KR', sans-serif" }}>
        친구에게 링크를 공유하고 두 결과를 나란히 비교해보세요
      </p>

      <div style={{ marginBottom: 24 }}>
        <button onClick={generateLink} className="btn-primary" style={{ marginRight: 12 }}>
          🔗 공유 링크 생성
        </button>
        {shareLink && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-3)', borderRadius: 12, border: '1px solid var(--card-border)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--mint)', marginBottom: 6, fontFamily: "'Noto Sans KR', sans-serif" }}>✅ 클립보드에 복사됨!</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all', fontFamily: "'Noto Sans KR', sans-serif" }}>{shareLink}</p>
          </div>
        )}
      </div>

      {friendResult ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[{ label: '나', data: myResult }, { label: '친구', data: friendResult.result }].map((side, i) => (
            <div key={i} style={{
              background: i === 0 ? 'rgba(124,58,237,0.1)' : 'rgba(0,201,167,0.1)',
              border: `1px solid ${i === 0 ? 'rgba(124,58,237,0.3)' : 'rgba(0,201,167,0.3)'}`,
              borderRadius: 16, padding: 20,
            }}>
              <h3 style={{
                fontSize: '1rem', fontWeight: 700, marginBottom: 16, color: i === 0 ? 'var(--purple-light)' : 'var(--mint)',
                fontFamily: "'Noto Sans KR', sans-serif",
              }}>
                {i === 0 ? '🦋' : '🌟'} {side.label}
              </h3>
              {fields.map(f => (
                <div key={f.key} style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, fontFamily: "'Noto Sans KR', sans-serif" }}>{f.label}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: "'Noto Sans KR', sans-serif" }}>
                    {side.data?.[f.key] || '—'}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          borderRadius: 16, padding: 40, textAlign: 'center', color: 'var(--text-muted)',
          fontFamily: "'Noto Sans KR', sans-serif",
        }}>
          친구의 링크를 받아서 접속하면 비교 결과가 여기에 표시됩니다
        </div>
      )}
    </div>
  )
}
