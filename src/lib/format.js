// Generic currency formatter driven by the active region.
export function formatMoney(value, region, { compact = false } = {}) {
  const n = Number(value) || 0
  return new Intl.NumberFormat(region.locale, {
    style: 'currency',
    currency: region.currency,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(n)
}
