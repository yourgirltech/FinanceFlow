import Anthropic from '@anthropic-ai/sdk'

// Server-only secret — never prefixed with VITE_, so Vite never bundles it
// into client JS. Set via Netlify env vars (or a local .env read by `netlify dev`).
const client = new Anthropic()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

const MODEL = 'claude-sonnet-5'
const MAX_QUESTION_LENGTH = 500
const MAX_HISTORY_TURNS = 8

const SYSTEM_PROMPT = `You are Finn, the spending-insights assistant inside a personal finance app called Finance Flow.

You are given a JSON "snapshot" describing one user's real spending for a given month: category totals, a comparison against last month and their 3-month averages, budget targets vs. actual spend, savings-goal progress, detected recurring charges, and their largest individual expenses. All amounts include a pre-formatted, currency-localized string (e.g. "amountFormatted") — always quote money using those pre-formatted strings verbatim rather than reformatting the raw number yourself, since the user's currency and locale vary.

Ground every claim strictly in the snapshot data. Never invent a transaction, category, or number that isn't present. If the data is insufficient to answer a question (e.g. it asks about a month or category with no data), say so plainly instead of guessing.

Style: sound like a sharp, friendly financial advisor, not a report generator. Prefer concrete comparisons ("you're spending 40% more on dining out this month than your average") over restating raw totals. Keep responses tight — 2 to 5 sentences unless the user clearly asked for more detail — and end with one concrete, actionable suggestion when it's natural to do so. Never use markdown headers or bullet lists for short answers; plain prose only.`

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

async function verifySupabaseUser(authHeader) {
  if (!authHeader?.startsWith('Bearer ') || !SUPABASE_URL || !SUPABASE_ANON_KEY) return false
  const token = authHeader.slice('Bearer '.length)
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_ANON_KEY },
    })
    return res.ok
  } catch {
    return false
  }
}

function buildUserContent({ mode, snapshot, question }) {
  const snapshotJson = JSON.stringify(snapshot)
  if (mode === 'summary') {
    return `Here is the user's financial snapshot for ${snapshot.monthLabel}:\n\n${snapshotJson}\n\nWrite a short, specific spending insight highlighting the single most notable pattern in this data, plus one concrete suggestion.`
  }
  return `Here is the user's financial snapshot for ${snapshot.monthLabel}:\n\n${snapshotJson}\n\nThe user asks: "${question}"\n\nAnswer using only this data.`
}

export default async (req) => {
  if (req.method !== 'POST') return jsonError('Method not allowed', 405)

  const isAuthed = await verifySupabaseUser(req.headers.get('authorization'))
  if (!isAuthed) return jsonError('Unauthorized', 401)

  let body
  try {
    body = await req.json()
  } catch {
    return jsonError('Invalid JSON body', 400)
  }

  const { mode, snapshot, question, history } = body || {}
  if (!snapshot || (mode !== 'summary' && mode !== 'ask')) {
    return jsonError('Missing snapshot or invalid mode', 400)
  }
  if (mode === 'ask') {
    if (typeof question !== 'string' || !question.trim()) return jsonError('Missing question', 400)
    if (question.length > MAX_QUESTION_LENGTH) return jsonError('Question is too long', 400)
  }

  const priorTurns = Array.isArray(history)
    ? history
        .filter((m) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
        .slice(-MAX_HISTORY_TURNS)
    : []

  const messages = [...priorTurns, { role: 'user', content: buildUserContent({ mode, snapshot, question }) }]

  let stream
  try {
    stream = client.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      output_config: { effort: 'medium' },
      messages,
    })
  } catch {
    return jsonError('Failed to reach Claude API. Check ANTHROPIC_API_KEY.', 502)
  }

  const encoder = new TextEncoder()
  const body_ = new ReadableStream({
    async start(controller) {
      stream.on('text', (text) => {
        controller.enqueue(encoder.encode(text))
      })
      try {
        await stream.finalMessage()
      } catch {
        controller.enqueue(encoder.encode('\n\n[Finn hit an error before finishing this response.]'))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(body_, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}

export const config = { path: '/api/spending-insights' }
