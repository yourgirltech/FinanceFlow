import { useState } from 'react'
import Modal from './Modal'
import Button from '../ui/Button'
import { CATEGORIES } from '../../lib/mockData'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function toDisplayDate(isoDate) {
  const [y, m, d] = isoDate.split('-')
  return `${MONTHS[Number(m) - 1]} ${d}`
}

function makeEmptyForm(categories) {
  const defaultCategory = categories.find((c) => c.name === 'Food & Dining') || categories[0]
  return {
    description: '',
    category: defaultCategory?.name || '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  }
}

export default function TransactionModal({ open, onClose, onSubmit, initial, categories = CATEGORIES }) {
  const isEdit = Boolean(initial)
  const [form, setForm] = useState(() =>
    initial
      ? { description: initial.description, category: initial.category, amount: String(initial.amount), date: initial.fullDate }
      : makeEmptyForm(categories)
  )
  const [error, setError] = useState('')

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const amountNum = Number(form.amount)
    if (!form.description.trim()) return setError('Add a short description.')
    if (!amountNum || amountNum <= 0) return setError('Enter an amount greater than zero.')
    if (!form.date) return setError('Pick a date.')

    const matched = categories.find((c) => c.name === form.category)
    const kind = matched?.kind ?? 'expense'
    const color = matched?.color ?? 'var(--color-slate)'

    onSubmit({
      description: form.description.trim(),
      category: form.category,
      color,
      kind,
      amount: Math.round(amountNum),
      date: toDisplayDate(form.date),
      fullDate: form.date,
    })
    setForm(makeEmptyForm(categories))
    setError('')
  }

  function handleClose() {
    setForm(makeEmptyForm(categories))
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={isEdit ? 'Edit transaction' : 'Add transaction'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate dark:text-white/50 mb-1.5 block">Description</label>
          <input
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="e.g. Grocery run"
            autoFocus
            className="w-full h-10 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-3.5 text-sm text-navy dark:text-white placeholder:text-slate-light dark:placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate dark:text-white/50 mb-1.5 block">Category</label>
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full h-10 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-3 text-sm text-navy dark:text-white focus:outline-none focus:border-gold transition-colors [color-scheme:light] dark:[color-scheme:dark]"
            >
              {categories.map((c) => (
                <option key={c.name} value={c.name} className="bg-white text-navy dark:bg-navy-2 dark:text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate dark:text-white/50 mb-1.5 block">Amount</label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.amount}
              onChange={(e) => update('amount', e.target.value)}
              placeholder="0"
              className="w-full h-10 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-3.5 text-sm text-navy dark:text-white font-tabular placeholder:text-slate-light dark:placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate dark:text-white/50 mb-1.5 block">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            className="w-full h-10 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-3.5 text-sm text-navy dark:text-white focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {error && <p className="text-xs text-red">{error}</p>}

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" variant="navGold" className="flex-1 h-10">
            {isEdit ? 'Save changes' : 'Add transaction'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose} className="h-10 px-5">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
