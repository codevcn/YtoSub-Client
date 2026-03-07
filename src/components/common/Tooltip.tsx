import { useRef, useState, useEffect } from 'react'

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

type TooltipProps = {
  content: string
  placement?: TooltipPlacement
  children: React.ReactNode
  className?: string
}

const PLACEMENT_CLASSES: Record<TooltipPlacement, { container: string; arrow: string }> = {
  top: {
    container: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    arrow:
      'top-full left-1/2 -translate-x-1/2 border-t-zinc-800 dark:border-t-zinc-100 border-x-transparent border-b-transparent border-4'
  },
  bottom: {
    container: 'top-full left-1/2 -translate-x-1/2 mt-2',
    arrow:
      'bottom-full left-1/2 -translate-x-1/2 border-b-zinc-800 dark:border-b-zinc-100 border-x-transparent border-t-transparent border-4'
  },
  left: {
    container: 'right-full top-1/2 -translate-y-1/2 mr-2',
    arrow:
      'left-full top-1/2 -translate-y-1/2 border-l-zinc-800 dark:border-l-zinc-100 border-y-transparent border-r-transparent border-4'
  },
  right: {
    container: 'left-full top-1/2 -translate-y-1/2 ml-2',
    arrow:
      'right-full top-1/2 -translate-y-1/2 border-r-zinc-800 dark:border-r-zinc-100 border-y-transparent border-l-transparent border-4'
  }
}

export function Tooltip({ content, placement = 'top', children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
    }
    setVisible(true)
  }

  const hide = () => {
    hideTimerRef.current = setTimeout(() => {
      setVisible(false)
    }, 80)
  }

  // Dọn dẹp bộ đếm thời gian khi component bị hủy khỏi giao diện
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
      }
    }
  }, [])

  const { container, arrow } = PLACEMENT_CLASSES[placement]

  return (
    <span className={`relative inline-flex items-center ${className ?? ''}`} onMouseEnter={show} onMouseLeave={hide}>
      {children}

      {visible && (
        <span
          className={`${container} pointer-events-none absolute z-50 w-max max-w-75 rounded-md bg-zinc-800 dark:bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-100 dark:text-zinc-800 shadow-lg animate-[fadeIn_0.12s_ease]`}
        >
          {content}
          <span className={`absolute ${arrow}`} />
        </span>
      )}
    </span>
  )
}
