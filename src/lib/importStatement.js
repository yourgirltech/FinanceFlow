import Papa from 'papaparse'
import { guessCategory, categoryColor } from './mockData'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function findColumn(headers, candidates) {
  const lower = headers.map((h) => h.toLowerCase().trim())
  for (const candidate of candidates) {
    const idx = lower.findIndex((h) => h.includes(candidate))
    if (idx !== -1) return headers[idx]
  }
  return null
}

function parseDate(raw) {
  if (!raw) return null
  const d = new Date(raw)
  if (isNaN(d.getTime())) return null
  return {
    date: `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`,
    fullDate: d.toISOString().slice(0, 10),
  }
}

function parseAmount(raw) {
  if (raw === undefined || raw === null) return null
  const cleaned = String(raw).replace(/[^0-9.\-]/g, '')
  const n = Number(cleaned)
  return isNaN(n) ? null : n
}

// Reads a CSV file, guesses which columns are date/description/amount, and
// returns structured transaction candidates ready for the preview screen.
// Doesn't touch the transactions store — that happens on explicit confirm.
export function parseStatementCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const headers = results.meta.fields || []
          if (headers.length === 0) {
            resolve({ rows: [], warning: "Couldn't find any columns in this file." })
            return
          }

          const dateCol = findColumn(headers, ['date', 'transaction date', 'posted'])
          const descCol = findColumn(headers, ['description', 'narration', 'details', 'memo', 'merchant'])
          const amountCol = findColumn(headers, ['amount', 'value', 'debit', 'credit'])

          const warning =
            !dateCol || !descCol || !amountCol
              ? "Couldn't confidently detect all columns — review carefully before importing."
              : null

          const rows = results.data
            .map((raw, i) => {
              const description = (descCol ? raw[descCol] : Object.values(raw)[1]) || 'Imported transaction'
              const rawAmount = amountCol ? raw[amountCol] : Object.values(raw)[2]
              const amount = parseAmount(rawAmount)
              const rawDate = dateCol ? raw[dateCol] : Object.values(raw)[0]
              const parsedDate = parseDate(rawDate) || parseDate(new Date())

              if (amount === null || amount === 0) return null

              const kind = amount < 0 ? 'expense' : 'income'
              const category = guessCategory(description, kind)

              return {
                id: `import-${i}-${Date.now()}`,
                description: String(description).trim().slice(0, 80),
                category,
                kind,
                color: categoryColor(category),
                amount: Math.round(Math.abs(amount)),
                date: parsedDate.date,
                fullDate: parsedDate.fullDate,
                include: true,
              }
            })
            .filter(Boolean)

          resolve({ rows, warning })
        } catch (err) {
          reject(err)
        }
      },
      error: (err) => reject(err),
    })
  })
}
