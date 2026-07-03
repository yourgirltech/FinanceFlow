import { useRef, useState } from 'react'

export default function UploadArea({ onFile, loading }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-colors duration-200 ${
        dragging
          ? 'border-gold bg-gold-soft/40 dark:bg-gold/10'
          : 'border-line dark:border-white/15 hover:border-slate-light dark:hover:border-white/30'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />

      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="text-sm text-slate dark:text-white/50">Reading your file…</p>
        </div>
      ) : (
        <>
          <div className="h-14 w-14 rounded-2xl bg-surface dark:bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <path d="M12 15V3M12 3l-4 4M12 3l4 4M4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4" stroke="var(--color-gold)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-sm font-medium text-navy dark:text-white mb-1">
            Drop your statement here, or click to browse
          </p>
          <p className="text-xs text-slate-light dark:text-white/35">
            CSV files exported from your bank — Excel support coming soon
          </p>
        </>
      )}
    </div>
  )
}
