module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { name } = req.query
  if (!name) return res.status(400).json({ error: 'name required' })

  const neisKey = process.env.NEIS_API_KEY

  if (!neisKey) {
    return res.status(200).json({
      message: 'NEIS_API_KEY가 설정되지 않았습니다. STEP4 기능은 API 키 발급 후 사용 가능합니다.',
      demo: true,
      schools: [],
    })
  }

  try {
    const neisUrl = `https://open.neis.go.kr/hub/schoolInfo?KEY=${neisKey}&Type=json&SCHUL_NM=${encodeURIComponent(name)}&pSize=5`
    const neisRes = await fetch(neisUrl)
    const neisData = await neisRes.json()
    const schools = neisData?.schoolInfo?.[1]?.row || []
    res.status(200).json({ schools, total: schools.length })
  } catch (err) {
    console.error('school error:', err)
    res.status(500).json({ error: err.message })
  }
}
