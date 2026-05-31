const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PUBLIC_DATA_CONTEXT = `
[교육 공공데이터 실제 수치 — 학교알리미·KESS·커리어넷 전처리]
동아리별 학교생활 만족도 증가율: 밴드/음악 +73%, 스포츠 +68%, 코딩/IT +61%, 미술/창작 +65%, 과학탐구 +58%, 봉사 +70%
동아리별 진로 연결률: 코딩/IT 45%, 과학탐구 52%, 미술/창작 38%, 봉사 29%, 밴드/음악 31%, 스포츠 22%
방과후 참여율(도농 격차): 스포츠(도시 82%↔농촌 54%), 예술(도시 79%↔농촌 48%), 코딩(도시 71%↔농촌 38%)
학생 자기효능감 데이터 피드백 제공 시 +18%p 상승 (커리어넷 진로교육 효과성 연구)
희망 진로 상위 5개: IT/소프트웨어, 의료/보건, 교육/연구, 예술/창작, 경영/금융 (커리어넷 2023)
전국 동아리 다양성 평균 74점 / 방과후 참여율 평균 71% / 학교생활 만족도 평균 70점
`

async function parseBody(req) {
  if (req.body) return req.body
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(data)) }
      catch { resolve({}) }
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

  const body = await parseBody(req)
  const { selections, mode = 'full', focusArea = null } = body

  if (!selections) return res.status(400).json({ error: 'selections required' })

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.' })
  }

  const AREA_LABELS = {
    학습: '학습 방법',
    동아리: '동아리 활동',
    공간: '학교 공간 이용',
    방과후: '방과후 활동',
    친구관계: '친구·관계',
  }

  const JSON_FORMAT = `아래 JSON 형식으로만 응답하세요 (마크다운 코드블록 없이 순수 JSON만):
{
  "summary": "2~3문장 전체 요약",
  "short": "단기 나비효과 (1~6개월). 각 문장은 반드시 \\n으로 구분. 2~3문장. 실제 수치 포함.",
  "mid": "중기 나비효과 (1~3년). 각 문장은 반드시 \\n으로 구분. 2~3문장. 진로·관계·학업 변화.",
  "long": "장기 나비효과 (졸업 후). 각 문장은 반드시 \\n으로 구분. 2~3문장. 사회·직업·삶에 미치는 연쇄 효과.",
  "stat1": "만족도 변화 — 반드시 +숫자% 형태만 (예: +15%). 절대 설명 추가 금지.",
  "stat2": "진로 연결률 — 반드시 숫자% 형태만 (예: 45%). 절대 설명 추가 금지.",
  "stat3": "핵심 수치 하나 — 반드시 +숫자%p 형태만 (예: +18%p). 절대 설명 추가 금지.",
  "advice": "AI의 구체적 조언 1~2문장",
  "gap": "지역 기회 격차 관련 경고 1~2문장 (없으면 null)",
  "sources": "학교알리미, KESS, 커리어넷"
}`

  let prompt

  if (mode === 'single' && focusArea) {
    // 단일 영역 집중 분석 프롬프트
    const areaLabel = AREA_LABELS[focusArea] || focusArea
    const areaValue = selections[focusArea] || ''
    prompt = `당신은 교육 공공데이터 전문가이자 진로 상담사입니다.
학생의 "${areaLabel}" 선택을 집중 분석해 나비효과를 JSON 형식으로 반환하세요.
나머지 영역(학습·동아리·공간·방과후·친구관계)은 평균적인 학생 패턴으로 가정하세요.

학생의 "${areaLabel}" 선택:
${areaValue}

활용할 실제 교육 공공데이터:
${PUBLIC_DATA_CONTEXT}

"${areaLabel}" 하나에 집중하여 이 선택이 학생의 미래에 미치는 구체적인 연쇄 효과를 분석하세요.
summary에는 반드시 "${areaLabel}: [선택 내용]" 형태로 분석한 항목을 명시하세요.

${JSON_FORMAT}`
  } else {
    // 전체 5개 영역 분석 프롬프트
    prompt = `당신은 교육 공공데이터 전문가이자 진로 상담사입니다.
학생의 학교 선택을 분석해 나비효과를 JSON 형식으로 반환하세요.

학생의 선택:
- 학습 방법: ${selections.학습 || ''}
- 동아리 활동: ${selections.동아리 || ''}
- 학교 공간 이용: ${selections.공간 || ''}
- 방과후 활동: ${selections.방과후 || ''}
- 친구·관계: ${selections.친구관계 || ''}

활용할 실제 교육 공공데이터:
${PUBLIC_DATA_CONTEXT}

${JSON_FORMAT}`
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text.trim()
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      const match = text.match(/\{[\s\S]*\}/)
      parsed = match ? JSON.parse(match[0]) : { summary: text, short: '', mid: '', long: '', stat1: '', stat2: '', stat3: '', advice: '', gap: null, sources: '' }
    }

    res.status(200).json(parsed)
  } catch (err) {
    console.error('analyze error:', err)
    res.status(500).json({ error: err.message || '분석 중 오류가 발생했습니다.' })
  }
}
