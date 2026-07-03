import { useState } from 'react'
import Modal from '../app/Modal'
import Button from '../ui/Button'

export default function GoalModal({ open, onClose, onSubmit, onClear, initial }) {
  const [name, setName] = useState(initial?.name || '')
  const [amount, setAmount] = useState(initial?.amount ? String(initial.amount) : '')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const num = Number(amount)
    if (!name.trim()) return setError('Give your goal a name — "Emergency fund", "New laptop"...')
    if (!num || num <= 0) return setError('Enter a target amount greater than zero.')
    onSubmit(name.trim(), Math.round(num))
    setError('')
  }

  return (
    <Modal open={open} onClose={onClose} title="Set a savings goal" maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate dark:text-white/50 mb-1.5 block">Goal name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Emergency fund"
            autoFocus
            className="w-full h-10 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-3.5 text-sm text-navy dark:text-white placeholder:text-slate-light dark:placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate dark:text-white/50 mb-1.5 block">Target amount</label>
          <input
            type="number"
            min="0"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="500000"
            className="w-full h-10 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-3.5 text-sm text-navy dark:text-white font-tabular placeholder:text-slate-light dark:placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        {error && <p className="text-xs text-red">{error}</p>}
        <div className="flex items-center gap-3">
          <Button type="submit" variant="navGold" className="flex-1 h-10">Save goal</Button>
          <Button type="button" variant="secondary" onClick={onClose} className="h-10 px-5">Cancel</Button>
        </div>
        {initial && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-red hover:underline block mx-auto pt-1"
          >
            Remove goal
          </button>
        )}
      </form>
    </Modal>
  )
}
