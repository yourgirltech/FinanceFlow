import Modal from './Modal'
import Button from '../ui/Button'

export default function ConfirmDeleteModal({ open, onClose, onConfirm, description, title = 'Delete transaction?' }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="text-sm text-slate dark:text-white/60 mb-6">
        {description ? (
          <>Delete <span className="text-navy dark:text-white font-medium">"{description}"</span>? This can't be undone.</>
        ) : (
          "This can't be undone."
        )}
      </p>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="danger"
          onClick={onConfirm}
          className="flex-1 h-10"
        >
          Delete
        </Button>
        <Button type="button" variant="secondary" onClick={onClose} className="h-10 px-5">
          Cancel
        </Button>
      </div>
    </Modal>
  )
}
