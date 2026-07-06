import { useState } from 'react'
import Modal from '../app/Modal'
import Button from '../ui/Button'

export default function AddCategoryModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Give it a name — "Rent", "Subscriptions", anything you like.')
      return
    }
    const num = Number(amount)
    if (!num || num <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }
    onSubmit(name.trim(), Math.round(num))
    setName('')
    setAmount('')
    setError('')
  }

  function handleClose() {
    setName('')
    setAmount('')
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add a budget category" maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate dark:text-white/50 mb-1.5 block">Category name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rent, Subscriptions, School fees"
            autoFocus
            className="w-full h-10 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-3.5 text-sm text-navy dark:text-white focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate dark:text-white/50 mb-1.5 block">Monthly limit</label>
          <input
            type="number"
            min="0"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full h-10 rounded-xl border border-line dark:border-white/15 bg-white dark:bg-white/[0.04] px-3.5 text-sm text-navy dark:text-white font-tabular focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        {error && <p className="text-xs text-red">{error}</p>}
        <div className="flex items-center gap-3">
          <Button type="submit" variant="navGold" className="flex-1 h-10">Add category</Button>
          <Button type="button" variant="secondary" onClick={handleClose} className="h-10 px-5">Cancel</Button>
        </div>
      </form>
    </Modal>
  )
}
