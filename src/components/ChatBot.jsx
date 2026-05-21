import { useState, useRef, useEffect } from 'react'

export default function ChatBot({ analysisResult, selections }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '안녕하세요! 나비효과에 대해 궁금한 것을 질문해보세요. 예: "동아리를 바꾸면 어떻게 될까요?"' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { role: 'user', content: text }
    const history = [...messages.slice(-9), userMsg]
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const base = import.meta.env.VITE_API_BASE_URL || ''
      const res = await fetch(`${base}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, analysisResult, selections }),
      })
      if (!res.ok) throw new Error('서버 오류')
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '죄송해요, 일시적인 오류가 발생했습니다. 다시 시도해주세요.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', marginBottom: 8 }}>
        🤖 나비효과 AI 챗봇
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20, fontFamily: "'Noto Sans KR', sans-serif" }}>
        분석 결과를 기반으로 궁금한 점을 물어보세요
      </p>

      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: 16, overflow: 'hidden',
      }}>
        {/* Messages */}
        <div style={{ height: 320, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '80%', padding: '12px 16px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: m.role === 'user' ? 'linear-gradient(135deg, var(--purple), var(--teal))' : 'var(--bg-3)',
                color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                fontSize: '0.9rem', lineHeight: 1.6,
                fontFamily: "'Noto Sans KR', sans-serif",
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: 'var(--bg-3)', padding: '12px 16px', borderRadius: '16px 16px 16px 4px' }}>
                <span style={{ animation: 'pulse 1s infinite', color: 'var(--text-muted)' }}>🦋 생각 중...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          display: 'flex', gap: 8, padding: 16,
          borderTop: '1px solid var(--card-border)',
          background: 'var(--bg-2)',
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="질문을 입력하세요..."
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 50,
              background: 'var(--card-bg)', border: '1px solid var(--card-border)',
              color: 'var(--text-primary)', fontSize: '0.9rem',
              outline: 'none', fontFamily: "'Noto Sans KR', sans-serif",
            }}
          />
          <button onClick={send} disabled={!input.trim() || loading} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            전송
          </button>
        </div>
      </div>
    </div>
  )
}
