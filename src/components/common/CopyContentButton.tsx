import { useState, useCallback } from 'react'
import { Icon } from './Icon'

type CopyContentButtonProps = {
  content: string
  className?: string
}

export function CopyContentButton({ content, className = '' }: CopyContentButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    if (copied) return
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy subtitle content:', err)
    }
  }, [content, copied])

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
        copied 
          ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30' 
          : 'text-zinc-500 dark:text-zinc-400 hover:text-(--main-cl) hover:bg-(--main-cl)/10 border border-transparent'
      } ${className}`}
      title={copied ? 'Đã sao chép' : 'Sao chép nội dung'}
    >
      <Icon name={copied ? 'check' : 'copy'} size={14} className="shrink-0" />
      <span>{copied ? 'Đã sao chép' : 'Copy'}</span>
    </button>
  )
}
