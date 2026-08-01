import { supabase } from './supabaseClient'

// Netlify Function endpoint (see netlify/functions/spending-insights.mjs).
// Same path works in production (Netlify) and locally via `netlify dev`.
const ENDPOINT = '/api/spending-insights'

async function authHeader() {
  if (!supabase) return {}
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Posts to the insights function and returns the raw response body stream.
// Throws with a human-readable message on any non-OK response.
export async function requestInsight({ mode, snapshot, question, history, signal }) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify({ mode, snapshot, question, history }),
    signal,
  })

  if (!res.ok || !res.body) {
    let message = `Request failed (${res.status})`
    try {
      const payload = await res.json()
      if (payload?.error) message = payload.error
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new Error(message)
  }

  return res.body
}

// Reads a text ReadableStream to completion, calling onChunk with the
// accumulated text after every chunk so callers can render progressively.
export async function streamText(body, onChunk) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let full = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    full += decoder.decode(value, { stream: true })
    onChunk?.(full)
  }
  return full
}
