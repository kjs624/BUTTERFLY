const https = require('https')
const http = require('http')

const CAREER_API_KEY = process.env.CAREER_NET_API_KEY

// 커리어넷 공식 API 파라미터 (POST + JSON 방식)
// q=5  → 직업흥미검사H형 질문, qestrnSeq=5  trgetSe=100207
// q=7  → 직업흥미검사K형 질문,  qestrnSeq=7  trgetSe=100207
const VERSIONS = {
  1: { q: '5', qestrnSeq: '5', trgetSe: '100207', name: '직업흥미검사(H형)', target: '고등학생',
       resultPath: 'interestHigh' },
  2: { q: '7', qestrnSeq: '7', trgetSe: '100207', name: '직업흥미검사(K형)', target: '고등학생',
       resultPath: 'interestJob' },
}

// GET 요청 (질문 조회용)
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          if (res.statusCode >= 400) {
            reject(new Error(`커리어넷 API 오류 ${res.statusCode}: ${data.slice(0, 200)}`))
          } else {
            resolve(json)
          }
        } catch (e) { reject(new Error('파싱 오류: ' + data.slice(0, 300))) }
      })
    }).on('error', reject)
  })
}

// POST + JSON 요청 (결과 제출용)
function postJson(body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body)
    const options = {
      hostname: 'www.career.go.kr',
      path: '/inspct/openapi/test/report',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr),
        'User-Agent': 'Mozilla/5.0',
      },
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          if (json.SUCC_YN === 'N') {
            reject(new Error(`커리어넷 오류: ${json.ERROR_REASON || '알 수 없는 오류'}`))
          } else if (res.statusCode >= 400) {
            reject(new Error(`커리어넷 API 오류 ${res.statusCode}: ${data.slice(0, 200)}`))
          } else {
            resolve(json)
          }
        } catch (e) { reject(new Error('파싱 오류: ' + data.slice(0, 300))) }
      })
    })
    req.on('error', reject)
    req.write(bodyStr)
    req.end()
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

  if (!CAREER_API_KEY) {
    return res.status(500).json({ ok: false, error: 'CAREER_NET_API_KEY 환경변수가 설정되지 않았습니다.' })
  }

  const params = req.query || {}

  // GET 질문 목록
  if (req.method === 'GET' && params.action === 'questions') {
    const version = parseInt(params.version) || 1
    const config = VERSIONS[version] || VERSIONS[1]
    const url = `https://www.career.go.kr/inspct/openapi/test/questions?apikey=${CAREER_API_KEY}&q=${config.q}`

    try {
      const data = await fetchUrl(url)
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
    // answersMap: [{q: qitemNo, v: value}, ...] — 프론트에서 실제 qitemNo 매핑 후 전달
    // answers(구버전): 단순 배열 — 폴백용
    const { version = 1, gender = '100323', grade = '2',
            answersMap, answers: legacyAnswers = [],
            refJob = '', startDtm } = body

    const ver = parseInt(version)
    const config = VERSIONS[ver] || VERSIONS[1]
    const now = startDtm || new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)

    // answersMap 우선 사용, 없으면 구버전 배열 변환
    // 텍스트(주관식) 답변은 숫자가 아니므로 반드시 제외
    let items = []
    if (Array.isArray(answersMap) && answersMap.length > 0) {
      items = answersMap.filter(item => item && typeof item.v === 'number')
    } else {
      items = legacyAnswers
        .map((v, i) => (typeof v === 'number' && v !== null) ? { q: i + 1, v } : null)
        .filter(Boolean)
    }

    if (!items.length) return res.status(400).json({ ok: false, error: '유효한 답변이 없습니다' })

    // H형: "B{qitemNo}={score}" · K형: "{qitemNo}={position}"
    const answersStr = items
      .map(({ q, v }) => ver === 1 ? `B${q}=${v}` : `${q}=${v}`)
      .join(' ')

    console.log(`[career-test] ver=${ver} qestrnSeq=${config.qestrnSeq} items=${items.length} refJob="${refJob}"`)
    console.log(`[career-test] answersStr(앞100자): ${answersStr.slice(0, 100)}`)

    const requestBody = {
      apikey: CAREER_API_KEY,
      qestrnSeq: config.qestrnSeq,
      trgetSe: config.trgetSe,
      gender,
      school: '',
      grade,
      startDtm: now,
      answers: answersStr,
      // K형 주관식(희망 직업)은 refJob 파라미터로 별도 전달
      ...(ver === 2 && refJob ? { refJob } : {}),
    }

    try {
      const data = await postJson(requestBody)
      console.log('[career-test] raw response:', JSON.stringify(data).slice(0, 500))
      const result = data?.RESULT || data?.result || data
      const inspctSeq = result?.inspctSeq || result?.INSPCT_SEQ || ''

      // API가 반환한 URL 우선, 없거나 결과 페이지가 아니면 inspctSeq로 직접 구성
      let url = result?.url || result?.URL || ''
      if ((!url || !url.includes('report')) && inspctSeq) {
        url = `https://www.career.go.kr/inspct/web/psycho/${config.resultPath}/report?seq=${inspctSeq}`
      }
      console.log('[career-test] report success, inspctSeq:', inspctSeq, 'url:', url)
      res.status(200).json({
        ok: true,
        result,
        url,
        inspctSeq,
        version: ver,
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
