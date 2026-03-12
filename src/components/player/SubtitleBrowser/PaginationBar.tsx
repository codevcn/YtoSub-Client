import { Icon } from '../../common/Icon'
import { buildPageNumbers } from './subtitle-browser-types'

// ─── PageButton ───────────────────────────────────────────────────────────────

type PageButtonProps = {
  pageNum: number
  isActive: boolean
  onPageChange: (page: number) => void
}

function PageButton({ pageNum, isActive, onPageChange }: PageButtonProps) {
  const handleClick = () => onPageChange(pageNum)
  return (
    <button
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center justify-center min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-(--main-cl) text-zinc-950 font-bold'
          : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
      }`}
    >
      {pageNum}
    </button>
  )
}

// ─── PaginationBar ────────────────────────────────────────────────────────────

type PaginationBarProps = {
  page: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function PaginationBar({ page, total, pageSize, onPageChange }: PaginationBarProps) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const pageNumbers = buildPageNumbers(page, totalPages)
  const navBtnCls =
    'flex items-center justify-center min-w-8 h-8 px-2 rounded-lg text-sm transition-colors text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed'

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1)
  }
  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1)
  }

  return (
    <div className="flex items-center justify-center gap-1 flex-wrap">
      <button onClick={handlePrev} disabled={page <= 1} aria-label="Trang trước" className={navBtnCls}>
        <Icon name="chevron-left" size={16} />
      </button>

      {pageNumbers.map((p, idx) =>
        p === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex items-center justify-center min-w-8 h-8 text-sm text-zinc-400 select-none"
          >
            …
          </span>
        ) : (
          <PageButton key={p} pageNum={p} isActive={p === page} onPageChange={onPageChange} />
        )
      )}

      <button onClick={handleNext} disabled={page >= totalPages} aria-label="Trang sau" className={navBtnCls}>
        <Icon name="chevron-right" size={16} />
      </button>
    </div>
  )
}
