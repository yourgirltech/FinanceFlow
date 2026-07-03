import { useEffect, useState } from 'react'
import Modal from './Modal'
import Button from '../ui/Button'

export default function BudgetTargetModal({ open, onClose, onSubmit, budget }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (budget) setAmount(String(budget.total))
  }, [budget])

  function handleSubmit(e) {
    e.preventDefault()
    const num = Number(amount)
    if (!num || num <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }
    onSubmit(num)
    setError('')
  }

  if (!budget) return null

  return (
    <Modal open={open} onClose={onClose} title={`Set budget — ${budget.category}`} maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate dark:text-white/50 mb-1.5 block">Monthly limit</label>
          <input
            type="number"
            min="0"
            step="1"
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-11 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-4 text-sm text-navy dark:text-white font-tabular focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        {error && <p className="text-xs text-red">{error}</p>}
        <div className="flex items-center gap-3">
          <Button type="submit" variant="navGold" className="flex-1 h-10">Save budget</Button>
          <Button type="button" variant="secondary" onClick={onClose} className="h-10 px-5">Cancel</Button>
        </div>
      </form>
    </Modal>
  )
}
