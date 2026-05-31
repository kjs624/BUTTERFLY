const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PUBLIC_DATA_CONTEXT = `
동아리별 학교생활 만족도 증가율: 밴드/음악 +73%, 스포츠 +68%, 코딩/IT +61%, 미술/창작 +65%, 과학탐구 +58%, 봉사 +70%
동아리별 진로 연결률: 코딩/IT 45%, 과학탐구 52%, 미술/창작 38%, 봉사 29%, 밴드/음악 31%, 스포츠 22%
학생 자기효능감 데이터 피드백 제공 시 +18%p 상승 (커리어넷 진로교육 효과성 연구)
`

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
  const { imageBase64, mediaType = 'image/jpeg' } = body

  if (!imageBase64) return res.status(400).json({ error: '이미지 데이터가 없습니다' })

  try {
    // STEP 1 — Vision으로 포스터 내용 추출
    const visionMsg = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: imageBase64 },
          },
          {
            type: 'text',
            text: `이 학교 행사 포스터를 분석해주세요. 마크다운 없이 순수 JSON만 응답하세요:
{
  "eventName": "행사 이름",
  "eventType": "행사 유형 (동아리/학술/문화/체육/봉사/진로/기타)",
  "activities": ["주요 활동1", "주요 활동2"],
  "targetAudience": "참여 대상",
  "description": "포스터 내용 2문장 요약"
}`,
          },
        ],
      }],
    })

    let posterInfo = { eventName: '학교 행사', eventType: '기타', activities: [], description: '' }
    try {
      const raw = visionMsg.content[0].text.trim()
      const m = raw.match(/\{[\s\S]*\}/)
      if (m) posterInfo = { ...posterInfo, ...JSON.parse(m[0]) }
    } catch { /* 파싱 실패 시 기본값 유지 */ }

    console.log('[poster] extracted:', posterInfo)

    // STEP 2 — 나비효과 분석
    const analysisMsg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `당신은 교육 공공데이터 전문가이자 진로 상담사입니다.
학생이 아래 학교 행사에 참여하는 것의 나비효과를 JSON으로 분석하세요.

행사 정보:
- 행사명: ${posterInfo.eventName}
- 유형: ${posterInfo.eventType}
- 주요 활동: ${(posterInfo.activities || []).join(', ') || '미확인'}
- 설명: ${posterInfo.description}

교육 공공데이터:
${PUBLIC_DATA_CONTEXT}

마크다운 없이 순수 JSON만 응답하세요:
{
  "summary": "이 행사 참여가 만들어낼 나비효과 2~3문장 요약",
  "short": "단기 나비효과 (1~6개월). 각 문장은 반드시 \\n으로 구분. 2~3문장. 실제 수치 포함.",
  "mid": "중기 나비효과 (1~3년). \\n 구분. 2~3문장.",
  "long": "장기 나비효과 (졸업 후). \\n 구분. 2~3문장.",
  "stat1": "+숫자% 형태만",
  "stat2": "숫자% 형태만",
  "stat3": "+숫자%p 형태만",
  "advice": "이 행사를 최대한 활용하는 구체적 조언 1~2문장",
  "gap": null,
  "sources": "학교알리미, KESS, 커리어넷"
}`,
      }],
    })

    const text = analysisMsg.content[0].text.trim()
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      const m = text.match(/\{[\s\S]*\}/)
      parsed = m ? JSON.parse(m[0]) : { summary: text, short: '', mid: '', long: '', stat1: '', stat2: '', stat3: '', advice: '', gap: null, sources: '' }
    }

    res.status(200).json({ ...parsed, posterInfo, mode: 'poster' })
  } catch (err) {
    console.error('poster error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
