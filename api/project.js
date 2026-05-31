const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function parseBody(req) {
  if (req.body) return req.body
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(data)) } catch { resolve({}) }
    })
    req.on('error', reject)
  })
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' })

  const body = await parseBody(req)
  const { topic, subject } = body

  if (!topic?.trim()) return res.status(400).json({ error: '수행평가 주제를 입력하세요' })

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2500,
      messages: [{
        role: 'user',
        content: `당신은 교육 전문가이자 진로 상담사입니다.
학생의 수행평가 주제를 분석해 나비효과와 진로 연결 정보를 JSON으로 반환하세요.

수행평가 정보:
- 과목: ${subject || '미입력'}
- 주제: ${topic}

교육 공공데이터:
- 희망 진로 상위 5개: IT/소프트웨어, 의료/보건, 교육/연구, 예술/창작, 경영/금융 (커리어넷 2023)
- 자기효능감 피드백 제공 시 +18%p 상승
- 프로젝트 학습 참여자 진로 연결률 +23%p 높음

마크다운 없이 순수 JSON만 응답하세요:
{
  "summary": "이 수행평가 주제가 진로에 갖는 의미 2~3문장",
  "short": "단기 나비효과 (1~6개월). \\n 구분. 2~3문장. 수행평가 과정에서 기르는 역량 포함.",
  "mid": "중기 나비효과 (1~3년). \\n 구분. 2~3문장. 내신·입시·진로와 연결.",
  "long": "장기 나비효과 (졸업 후). \\n 구분. 2~3문장. 직업·사회 영향.",
  "stat1": "+숫자% 형태만",
  "stat2": "숫자% 형태만",
  "stat3": "+숫자%p 형태만",
  "advice": "이 수행평가를 포트폴리오·진로로 연결하는 구체적 조언 1~2문장",
  "gap": null,
  "sources": "커리어넷, KESS, 학교알리미",
  "careers": ["관련직업1", "관련직업2", "관련직업3", "관련직업4", "관련직업5"],
  "careerTestType": "H형 또는 K형 (더 적합한 것 하나만)",
  "careerTestReason": "이 검사를 추천하는 이유 1문장",
  "keywords": ["핵심역량1", "핵심역량2", "핵심역량3"]
}`,
      }],
    })

    const text = msg.content[0].text.trim()
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      const m = text.match(/\{[\s\S]*\}/)
      parsed = m ? JSON.parse(m[0]) : { summary: text, short: '', mid: '', long: '', careers: [], keywords: [] }
    }

    res.status(200).json({ ...parsed, mode: 'project', topic, subject })
  } catch (err) {
    console.error('project error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
