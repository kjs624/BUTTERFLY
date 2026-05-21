import Anthropic from '@anthropic-ai/sdk'

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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { selections } = req.body
  if (!selections) return res.status(400).json({ error: 'selections required' })

  const prompt = `당신은 교육 공공데이터 전문가이자 진로 상담사입니다.
학생의 학교 선택을 분석해 나비효과를 JSON 형식으로 반환하세요.

학생의 선택:
- 학습 방법: ${selections.학습 || ''}
- 동아리 활동: ${selections.동아리 || ''}
- 학교 공간 이용: ${selections.공간 || ''}
- 방과후 활동: ${selections.방과후 || ''}
- 친구·관계: ${selections.친구관계 || ''}

활용할 실제 교육 공공데이터:
${PUBLIC_DATA_CONTEXT}

아래 JSON 형식으로만 응답하세요 (코드블록 없이):
{
  "summary": "2~3문장 전체 요약",
  "short": "단기 나비효과 (1~6개월) — 구체적 변화와 실제 수치 포함, 2~3문장",
  "mid": "중기 나비효과 (1~3년) — 진로·관계·학업 변화, 2~3문장",
  "long": "장기 나비효과 (졸업 후) — 사회·직업·삶에 미치는 연쇄 효과, 2~3문장",
  "stat1": "만족도 변화 수치 (예: +15%)",
  "stat2": "진로 연결률 (예: 45%)",
  "stat3": "핵심 수치 하나 (예: +18%p)",
  "advice": "AI의 구체적 조언 1~2문장",
  "gap": "지역 기회 격차 관련 경고 (해당 시 작성, 없으면 null)",
  "sources": "참고한 데이터 출처 (학교알리미, KESS, 커리어넷 등 콤마 구분)"
}`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text.trim()
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      const match = text.match(/\{[\s\S]*\}/)
      parsed = match ? JSON.parse(match[0]) : { summary: text, short: '', mid: '', long: '' }
    }

    res.status(200).json(parsed)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
