import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Icon } from './Icon'

export type PopoverPosition = 'top' | 'bottom'

export type PopoverProps = {
  /** Element trigger popover */
  trigger: ReactNode
  /** Nội dung của popover */
  children: ReactNode
  /** Vị trí của popover so với trigger (mặc định: 'bottom') */
  position?: PopoverPosition
  /** Custom class cho phần content */
  className?: string
  closeBtnSize?: number
}

export function Popover({ trigger, children, position = 'bottom', className = '', closeBtnSize = 16 }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Đóng popover khi click ra ngoài
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    // Đóng popover khi bấm phím Escape
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const togglePopover = () => setIsOpen(prev => !prev)

  // Xử lý vị trí hiển thị
  const positionClasses =
    position === 'top'
      ? 'bottom-[calc(100%+0.5rem)] mb-0' // Cạnh trên cách trigger 0.5rem
      : 'top-[calc(100%+0.5rem)] mt-0' // Cạnh dưới cách trigger 0.5rem

  // Animation classes
  const animationClasses = isOpen
    ? 'opacity-100 scale-100 translate-y-0'
    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'

  return (
    <div ref={popoverRef} className="relative inline-block">
      {/* Trigger */}
      <div onClick={togglePopover} aria-expanded={isOpen} aria-haspopup="true" className="cursor-pointer inline-block">
        {trigger}
      </div>

      {/* Popover Content */}
      <div
        role="dialog"
        className={`absolute left-0 z-50 min-w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 p-4 transform origin-top-left transition-all duration-200 ease-out ${positionClasses} ${animationClasses} ${className}`}
      >
        {/* Nút đóng ở góc */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-1 right-1 p-1 text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          aria-label="Đóng popover"
        >
          <Icon name="close" size={closeBtnSize} />
        </button>

        <div className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">{children}</div>
      </div>
    </div>
  )
}
