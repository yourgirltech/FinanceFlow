import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TextEncoder } from 'node:util'
import SpendingAssistant from './SpendingAssistant'

// A minimal stand-in for the ReadableStream the real Netlify function
// returns — exposes just the getReader()/read() shape aiClient.streamText()
// relies on, without depending on jsdom's (incomplete) streams support.
function fakeBodyStream(chunks) {
  let i = 0
  return {
    getReader() {
      return {
        read: async () => {
          if (i < chunks.length) return { done: false, value: new TextEncoder().encode(chunks[i++]) }
          return { done: true, value: undefined }
        },
      }
    },
  }
}

function renderWithClient(ui) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

const snapshot = {
  monthKey: '2026-06',
  monthLabel: 'June 2026',
  fingerprint: 'fingerprint-abc',
  transactionCount: 5,
}

describe('SpendingAssistant', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches and renders the streamed monthly summary', async () => {
    global.fetch = vi.fn(async () => ({
      ok: true,
      body: fakeBodyStream(["You're spending ", 'more on dining this month.']),
    }))

    renderWithClient(<SpendingAssistant snapshot={snapshot} />)

    await waitFor(() => {
      expect(screen.getByText(/spending more on dining this month/i)).toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/spending-insights', expect.objectContaining({ method: 'POST' }))
    const [, options] = global.fetch.mock.calls[0]
    expect(JSON.parse(options.body)).toMatchObject({ mode: 'summary' })
  })

  it('lets the user ask a question via a suggested chip and renders the streamed answer', async () => {
    global.fetch = vi.fn(async (_url, options) => {
      const parsed = JSON.parse(options.body)
      if (parsed.mode === 'summary') return { ok: true, body: fakeBodyStream(['This month looks steady.']) }
      return { ok: true, body: fakeBodyStream(['Try trimming ', 'your dining budget.']) }
    })

    const user = userEvent.setup()
    renderWithClient(<SpendingAssistant snapshot={snapshot} />)

    await waitFor(() => expect(screen.getByText('This month looks steady.')).toBeInTheDocument())

    await user.click(screen.getByText('Where can I cut back?'))

    await waitFor(() => {
      expect(screen.getByText('Try trimming your dining budget.')).toBeInTheDocument()
    })

    const askCall = global.fetch.mock.calls.find(([, options]) => JSON.parse(options.body).mode === 'ask')
    expect(JSON.parse(askCall[1].body)).toMatchObject({ question: 'Where can I cut back?' })
  })

  it('shows an empty state and makes no request when there are no transactions yet', () => {
    global.fetch = vi.fn()
    renderWithClient(<SpendingAssistant snapshot={{ ...snapshot, transactionCount: 0 }} />)

    expect(screen.getByText(/add a few transactions first/i)).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
