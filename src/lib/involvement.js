export const TIER_RANK = { simple: 0, planner: 1, power: 2 }
export const TIER_LABELS = { simple: '🌱 Simple', planner: '📊 Planner', power: '🚀 Power User' }

export function meetsTier(involvement, requiredTier) {
  const rank = TIER_RANK[involvement || 'power'] ?? TIER_RANK.power
  return rank >= TIER_RANK[requiredTier]
}
