import Papa from 'papaparse'
import * as XLSX from 'xlsx'
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
  const d = raw instanceof Date ? raw : new Date(raw)
  if (isNaN(d.getTime())) return null
  return {
    date: `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`,
    fullDate: d.toISOString().slice(0, 10),
  }
}

function parseAmount(raw) {
  if (raw === undefined || raw === null || raw === '') return null
  if (typeof raw === 'number') return raw
  const cleaned = String(raw).replace(/[^0-9.\-]/g, '')
  const n = Number(cleaned)
  return isNaN(n) ? null : n
}

// Shared by both CSV and Excel — once each is parsed into an array of plain
// row objects keyed by header, the column-guessing and transaction-building
// logic is identical.
function rowsFromObjects(data, headers) {
  if (!headers || headers.length === 0) {
    return { rows: [], warning: "Couldn't find any columns in this file." }
  }

  const dateCol = findColumn(headers, ['date', 'transaction date', 'posted'])
  const descCol = findColumn(headers, ['description', 'narration', 'details', 'memo', 'merchant'])
  const amountCol = findColumn(headers, ['amount', 'value', 'debit', 'credit'])

  const warning =
    !dateCol || !descCol || !amountCol
      ? "Couldn't confidently detect all columns — review carefully before importing."
      : null

  const rows = data
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

  return { rows, warning }
}

function parseStatementCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          resolve(rowsFromObjects(results.data, results.meta.fields || []))
        } catch (err) {
          reject(err)
        }
      },
      error: (err) => reject(err),
    })
  })
}

function parseStatementExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array', cellDates: true })
        const sheetName = workbook.SheetNames[0]
        if (!sheetName) {
          resolve({ rows: [], warning: "Couldn't find any sheets in this file." })
          return
        }
        const sheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(sheet, { defval: '' })
        const headers = data.length > 0 ? Object.keys(data[0]) : []
        resolve(rowsFromObjects(data, headers))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Could not read file.'))
    reader.readAsArrayBuffer(file)
  })
}

// Single entry point the UI calls — dispatches by file extension so the
// upload area doesn't need to know or care which parser handles which type.
export function parseStatementFile(file) {
  const name = file.name.toLowerCase()
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    return parseStatementExcel(file)
  }
  return parseStatementCSV(file)
}
