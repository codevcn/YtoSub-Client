import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from '../../utils/toast-store'
import type { Toast } from '../../utils/toast-store'

// ─── icons per type ───────────────────────────────────────────────────────────

function ToastIcon({ type }: { type: Toast['type'] }) {
  switch (type) {
    case 'success':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    case 'error':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )
    case 'warning':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    case 'info':
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
  }
}

// ─── per-type styles ──────────────────────────────────────────────────────────

const TYPE_STYLES: Record<Toast['type'], string> = {
  success: 'bg-green-700 dark:bg-green-800 border-green-600/40 text-white',
  error:   'bg-red-700 dark:bg-red-800 border-red-600/40 text-white',
  warning: 'bg-amber-500 dark:bg-amber-600 border-amber-400/40 text-white',
  info:    'bg-zinc-800 dark:bg-zinc-700 border-zinc-700/40 text-white',
}

// ─── ToastItem ────────────────────────────────────────────────────────────────

type ToastItemProps = {
  item: Toast
}

function ToastItem({ item }: ToastItemProps) {
  const handleClose = () => toast.remove(item.id)

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`STYLE-toast-slide-in flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl border min-w-64 max-w-sm w-full ${TYPE_STYLES[item.type]}`}
    >
      <span className="block shrink-0 my-auto">
        <ToastIcon type={item.type} />
      </span>
      <p className="flex-1 text-sm leading-snug wrap-break-word">{item.message}</p>
      <button
        onClick={handleClose}
        aria-label="Đóng thông báo"
        className="shrink-0 mt-0.5 opacity-70 hover:opacity-100 transition-opacity"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

// ─── Toaster ──────────────────────────────────────────────────────────────────

type ToasterProps = {
  maxToasts?: number
}

export function Toaster({ maxToasts = 5 }: ToasterProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return toast.subscribe(setToasts)
  }, [])

  const visible = toasts.slice(-maxToasts)

  if (visible.length === 0) return null

  return createPortal(
    <div className="fixed bottom-5 right-4 z-9999 flex flex-col items-end gap-2 pointer-events-none">
      {visible.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem item={t} />
        </div>
      ))}
    </div>,
    document.body
  )
}
