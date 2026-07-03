import { guessCategory, categoryKind, categoryColor } from './mockData'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function todayParts() {
  const d = new Date()
  return {
    date: `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`,
    fullDate: d.toISOString().slice(0, 10),
  }
}

// Parses input like "Food 25", "Salary 4000", "Bolt 20.50" into a structured
// transaction. Amount is whichever number sits at the end of the string;
// everything before it is the description, whose first keyword decides the
// category (via the shared keyword map in mockData.js).
export function parseQuickAdd(input) {
  const trimmed = input.trim()
  if (!trimmed) return { error: 'Type something like "Food 25".' }

  const match = trimmed.match(/^(.*?)\s*([\d,]+(?:\.\d+)?)\s*$/)
  if (!match || !match[1].trim()) {
    return { error: 'Add an amount at the end — try "Food 25".' }
  }

  const [, rawDesc, rawAmount] = match
  const amount = Number(rawAmount.replace(/,/g, ''))
  if (!amount || amount <= 0) {
    return { error: 'Amount must be greater than zero.' }
  }

  const description = rawDesc.trim()
  const capitalized = description.charAt(0).toUpperCase() + description.slice(1)

  // Try guessing as an expense first (most common), but if the keyword is
  // actually an income keyword (salary, freelance…), guessCategory finds it
  // regardless of the fallbackKind we pass — the fallback only matters when
  // no keyword matches at all.
  const category = guessCategory(description, 'expense')
  const kind = categoryKind(category)
  const { date, fullDate } = todayParts()

  return {
    description: capitalized,
    category,
    kind,
    color: categoryColor(category),
    amount: Math.round(amount),
    date,
    fullDate,
  }
}
