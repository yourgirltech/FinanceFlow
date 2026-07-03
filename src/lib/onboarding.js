// Plain (non-hook) helpers so both the Onboarding page and the post-login
// redirect logic in Login/Signup can check/save this without needing a
// mounted React component tree in between.

function storageKey(userId) {
  return `finance-flow-onboarding-${userId || 'guest'}`
}

const defaultState = {
  complete: false,
  involvement: null, // 'simple' | 'planner' | 'power'
  trackingStyle: null, // 'quick-add' | 'manual' | 'import' | 'bank'
}

export function getOnboardingState(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (raw) return { ...defaultState, ...JSON.parse(raw) }
  } catch {
    // fall through to default on corrupt data
  }
  return { ...defaultState }
}

export function saveOnboardingState(userId, state) {
  localStorage.setItem(storageKey(userId), JSON.stringify(state))
}
