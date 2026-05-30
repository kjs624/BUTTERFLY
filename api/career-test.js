const https = require('https')
const http = require('http')

const CAREER_API_KEY = process.env.CAREER_NET_API_KEY || '43f5190dec8329d2d10afc58319967f6'

const VERSIONS = {
  1: { q: '6', qestrnSeq: '6', trgetSe: '100000', name: '직업흥미검사(H형)', target: '중학생' },
  2: { q: '7', qestrnSeq: '7', trgetSe: '100001', name: '직업흥미검사(K형)', target: '고등학생/일반' },
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          // HTTP 4xx/5xx 또는 JSON 내 error 필드 감지
          if (res.statusCode >= 400 || (json.error && json.status >= 400)) {
            reject(new Error(`커리어넷 API 오류 ${res.statusCode}: ${json.error || data.slice(0, 200)}`))
          } else {
            resolve(json)
          }
        } catch (e) { reject(new Error('파싱 오류: ' + data.slice(0, 300))) }
      })
    }).on('error', reject)
  })
}

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const params = req.query || {}

  // GET 질문 목록
  if (req.method === 'GET' && params.action === 'questions') {
    const version = parseInt(params.version) || 1
    const config = VERSIONS[version] || VERSIONS[1]
    const url = `https://www.career.go.kr/inspct/openapi/test/questions?apikey=${CAREER_API_KEY}&q=${config.q}`

    try {
      const data = await fetchUrl(url)
      // 커리어넷 응답 정규화 (result 배열 추출)
      const questions = data?.result || data?.RESULT || []
      res.status(200).json({ ok: true, questions, config })
    } catch (err) {
      console.error('career-test questions error:', err.message)
      res.status(500).json({ ok: false, error: err.message })
    }
    return
  }

  // POST 답변 제출 → 결과
  if (req.method === 'POST') {
    const body = await parseBody(req)
    const { version = 1, gender = '100323', grade = '2', answers = [], startDtm } = body

    if (!answers.length) return res.status(400).json({ ok: false, error: '답변이 없습니다' })

    const config = VERSIONS[parseInt(version)] || VERSIONS[1]
    const now = startDtm || new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
    // 쉼표는 그대로 두고 각 답변 값만 인코딩 (encodeURIComponent는 쉼표를 %2C로 바꿔서 400 오류 유발)
    const answersStr = answers.map(a => encodeURIComponent(String(a))).join(',')

    const url = `https://www.career.go.kr/inspct/openapi/test/report?apikey=${CAREER_API_KEY}&qestrnSeq=${config.qestrnSeq}&trgetSe=${config.trgetSe}&gender=${gender}&grade=${grade}&startDtm=${now}&answers=${answersStr}`
    console.log('[career-test] report URL (answers sample):', answersStr.slice(0, 80))

    try {
      const data = await fetchUrl(url)
      // 커리어넷은 RESULT(대문자) 또는 result(소문자)로 반환
      const result = data?.result || data?.RESULT || data
      console.log('[career-test] report raw keys:', Object.keys(data || {}))
      console.log('[career-test] result keys:', Object.keys(result || {}))
      res.status(200).json({
        ok: true,
        result,
        version: parseInt(version),
        config,
      })
    } catch (err) {
      console.error('career-test report error:', err.message)
      res.status(500).json({ ok: false, error: err.message })
    }
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
