export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { name } = req.query
  if (!name) return res.status(400).json({ error: 'name required' })

  const neisKey = process.env.NEIS_API_KEY
  const schoolKey = process.env.SCHOOLINFO_API_KEY

  if (!neisKey || !schoolKey) {
    return res.status(200).json({
      message: 'API 키가 설정되지 않았습니다. NEIS_API_KEY와 SCHOOLINFO_API_KEY를 Vercel 환경변수에 등록해주세요.',
      demo: true,
    })
  }

  try {
    // NEIS 학교 기본정보 조회
    const neisUrl = `https://open.neis.go.kr/hub/schoolInfo?KEY=${neisKey}&Type=json&SCHUL_NM=${encodeURIComponent(name)}&pSize=5`
    const neisRes = await fetch(neisUrl)
    const neisData = await neisRes.json()

    const schools = neisData?.schoolInfo?.[1]?.row || []

    res.status(200).json({ schools, total: schools.length })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
