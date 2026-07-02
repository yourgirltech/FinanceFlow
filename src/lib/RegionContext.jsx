import { createContext, useContext, useEffect, useState } from 'react'

// Each region carries its own currency, locale, illustrative bank names, and
// sample dashboard figures — so switching region doesn't just change a symbol,
// it makes the whole preview feel native to that market.
export const REGIONS = [
  {
    code: 'NG',
    country: 'Nigeria',
    flag: '🇳🇬',
    currency: 'NGN',
    symbol: '₦',
    currencyWord: 'naira',
    locale: 'en-NG',
    banks: ['GTBank', 'Access Bank', 'UBA', 'Zenith Bank', 'First Bank'],
    sample: { balance: 2450000, income: 840000, expenses: 412300, budgetSpent: 68000, budgetTotal: 100000, txn: 12400 },
  },
  {
    code: 'US',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    symbol: '$',
    currencyWord: 'dollar',
    locale: 'en-US',
    banks: ['Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'Capital One'],
    sample: { balance: 24500, income: 8400, expenses: 4123, budgetSpent: 680, budgetTotal: 1000, txn: 124 },
  },
  {
    code: 'GB',
    country: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    symbol: '£',
    currencyWord: 'pound',
    locale: 'en-GB',
    banks: ['Barclays', 'HSBC', 'Lloyds', 'NatWest', 'Monzo'],
    sample: { balance: 19800, income: 6200, expenses: 3140, budgetSpent: 540, budgetTotal: 800, txn: 98 },
  },
  {
    code: 'KE',
    country: 'Kenya',
    flag: '🇰🇪',
    currency: 'KES',
    symbol: 'KSh',
    currencyWord: 'shilling',
    locale: 'en-KE',
    banks: ['Equity Bank', 'KCB', 'Co-operative Bank', 'Absa', 'NCBA'],
    sample: { balance: 318000, income: 108000, expenses: 53600, budgetSpent: 8800, budgetTotal: 13000, txn: 1600 },
  },
  {
    code: 'GH',
    country: 'Ghana',
    flag: '🇬🇭',
    currency: 'GHS',
    symbol: 'GH₵',
    currencyWord: 'cedi',
    locale: 'en-GH',
    banks: ['GCB Bank', 'Ecobank', 'Stanbic Bank', 'Fidelity Bank', 'Absa'],
    sample: { balance: 29400, income: 10080, expenses: 4950, budgetSpent: 816, budgetTotal: 1200, txn: 148 },
  },
  {
    code: 'ZA',
    country: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR',
    symbol: 'R',
    currencyWord: 'rand',
    locale: 'en-ZA',
    banks: ['Standard Bank', 'FNB', 'Absa', 'Nedbank', 'Capitec'],
    sample: { balance: 44500, income: 15200, expenses: 7480, budgetSpent: 1240, budgetTotal: 1800, txn: 224 },
  },
]

const RegionContext = createContext(null)

export function RegionProvider({ children }) {
  const [regionCode, setRegionCode] = useState(() => {
    if (typeof window === 'undefined') return 'NG'
    return localStorage.getItem('finance-flow-region') || 'NG'
  })

  useEffect(() => {
    localStorage.setItem('finance-flow-region', regionCode)
  }, [regionCode])

  const region = REGIONS.find((r) => r.code === regionCode) || REGIONS[0]

  return (
    <RegionContext.Provider value={{ region, setRegionCode, regions: REGIONS }}>
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion() {
  const ctx = useContext(RegionContext)
  if (!ctx) throw new Error('useRegion must be used within RegionProvider')
  return ctx
}
