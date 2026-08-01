import { useState } from 'react'
import { useSpendingSummary, useAskFinance } from '../../lib/useSpendingInsights'

const SUGGESTED_QUESTIONS = [
  'Where can I cut back?',
  'Am I on track for my savings goal?',
  "What's my biggest expense this month?",
  'Any recurring charges I should reconsider?',
]

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path
        d="M3 12a9 9 0 0115.3-6.4M21 12a9 9 0 01-15.3 6.4M3 4v5h5M21 20v-5h-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Reads the user's real transaction/budget data (via the `snapshot` prop
// built by financialSnapshot.js) and turns it into a proactive natural-
// language summary plus a free-form Q&A chat, both backed by Claude through
// the netlify/functions/spending-insights.mjs proxy. Kept as a standalone,
// snapshot-in/UI-out component so it's independently testable with RTL.
export default function SpendingAssistant({ snapshot }) {
  const hasTransactions = snapshot.transactionCount > 0

  const [liveSummary, setLiveSummary] = useState('')
  const {
    data: summary,
    isFetching: summaryLoading,
    isError: summaryErrored,
    refetch: regenerate,
  } = useSpendingSummary(snapshot, { onChunk: setLiveSummary, enabled: hasTransactions })

  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [liveAnswer, setLiveAnswer] = useState('')
  const askFinance = useAskFinance()

  const summaryText = summaryLoading ? liveSummary : summary || liveSummary

  function handleAsk(text) {
    const q = text.trim()
    if (!q || askFinance.isPending) return
    const history = messages.slice(-8)
    setMessages((prev) => [...prev, { role: 'user', content: q }])
    setQuestion('')
    setLiveAnswer('')
    askFinance.mutate(
      { snapshot, question: q, history, onChunk: setLiveAnswer },
      {
        onSuccess: (finalText) => {
          setMessages((prev) => [...prev, { role: 'assistant', content: finalText }])
          setLiveAnswer('')
        },
        onError: (err) => {
          setMessages((prev) => [...prev, { role: 'assistant', content: `Sorry, I couldn't answer that: ${err.message}` }])
          setLiveAnswer('')
        },
      }
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    handleAsk(question)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-navy dark:bg-white/[0.04] p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-semibold tracking-wide text-gold uppercase">Finn's take on {snapshot.monthLabel}</span>
          {hasTransactions && (
            <button
              onClick={() => regenerate()}
              disabled={summaryLoading}
              aria-label="Regenerate insight"
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 disabled:opacity-40 transition-colors shrink-0"
            >
              <RefreshIcon />
              Regenerate
            </button>
          )}
        </div>

        {!hasTransactions ? (
          <p className="relative text-sm text-white/40 py-2">Add a few transactions first — Finn needs something to analyze.</p>
        ) : summaryErrored && !summaryText ? (
          <div className="relative text-sm text-white/60">
            <p className="mb-2">
              Couldn't reach Finn. If you're testing locally, make sure <code className="text-white/80">netlify dev</code> is running
              and <code className="text-white/80">ANTHROPIC_API_KEY</code> is set.
            </p>
            <button onClick={() => regenerate()} className="text-gold hover:underline text-xs font-semibold">
              Try again
            </button>
          </div>
        ) : (
          <p className="relative text-[15px] text-white/90 leading-relaxed whitespace-pre-wrap min-h-[1.5em]">
            {summaryText || (summaryLoading ? 'Thinking…' : '')}
          </p>
        )}
      </div>

      {hasTransactions && (
        <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-line dark:border-white/10 p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-wide text-slate dark:text-white/50 uppercase mb-4">Ask Finn anything</p>

          {messages.length === 0 && !askFinance.isPending && (
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleAsk(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-line dark:border-white/15 text-slate dark:text-white/60 hover:border-gold hover:text-navy dark:hover:text-white transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {(messages.length > 0 || askFinance.isPending) && (
            <div className="space-y-3 mb-4 max-h-[420px] overflow-y-auto pr-1">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-xl px-4 py-3 text-[14px] leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'ml-auto bg-navy text-white dark:bg-white/10'
                      : 'bg-surface dark:bg-white/[0.06] text-navy dark:text-white/85'
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {askFinance.isPending && (
                <div className="rounded-xl px-4 py-3 text-[14px] leading-relaxed max-w-[85%] bg-surface dark:bg-white/[0.06] text-navy dark:text-white/85 whitespace-pre-wrap">
                  {liveAnswer || 'Thinking…'}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Where can I cut back?"
              className="flex-1 min-w-0 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-transparent px-4 py-2.5 text-sm text-navy dark:text-white placeholder:text-slate-light dark:placeholder:text-white/30 focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={!question.trim() || askFinance.isPending}
              aria-label="Send question"
              className="h-10 w-10 rounded-xl bg-navy dark:bg-white/10 text-gold flex items-center justify-center shrink-0 disabled:opacity-30 transition-opacity"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
