import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { messages, analysisResult, selections } = req.body
  if (!messages) return res.status(400).json({ error: 'messages required' })

  const systemPrompt = `당신은 BUTTERFLY 나비효과 AI 상담사입니다.
학생의 학교 선택과 이미 분석된 나비효과 결과를 바탕으로 추가 질문에 친절하게 답변하세요.

학생의 선택:
${Object.entries(selections || {}).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

기존 분석 결과 요약:
${analysisResult?.summary || ''}

답변 지침:
- 한국어로 친절하고 구체적으로 답변
- 교육 공공데이터 수치를 가능하면 포함
- 가정 질문("~하면 어떻게 될까?")에는 데이터 기반 시나리오 제시
- 3~5문장으로 간결하게`

  try {
    const apiMessages = messages.map(m => ({ role: m.role, content: m.content }))

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: systemPrompt,
      messages: apiMessages,
    })

    res.status(200).json({ content: message.content[0].text })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
