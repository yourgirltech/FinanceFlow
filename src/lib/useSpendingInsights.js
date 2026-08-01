import { useMutation, useQuery } from '@tanstack/react-query'
import { requestInsight, streamText } from './aiClient'

// Proactive, auto-generated natural-language summary for the selected
// month. Cached per (month, fingerprint) so switching tabs or re-rendering
// doesn't re-spend tokens — only a real data change or a manual refetch()
// (wired to a "Regenerate" button) triggers a new call. `onChunk` fires with
// the accumulated text as it streams in, for a live-typing effect.
export function useSpendingSummary(snapshot, { onChunk, enabled = true } = {}) {
  return useQuery({
    queryKey: ['ai-insight-summary', snapshot?.monthKey, snapshot?.fingerprint],
    queryFn: async ({ signal }) => {
      const body = await requestInsight({ mode: 'summary', snapshot, signal })
      return streamText(body, onChunk)
    },
    enabled: Boolean(snapshot) && enabled,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: 1,
  })
}

// Free-form Q&A ("where can I cut back?"). Each call streams its answer into
// the caller-provided onChunk and resolves with the final text.
export function useAskFinance() {
  return useMutation({
    mutationFn: async ({ snapshot, question, history, onChunk }) => {
      const body = await requestInsight({ mode: 'ask', snapshot, question, history })
      return streamText(body, onChunk)
    },
  })
}
