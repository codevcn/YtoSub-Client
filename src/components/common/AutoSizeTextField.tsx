import { useRef, useLayoutEffect } from 'react'

type AutoSizeTextFieldProps = {
  id?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  disabled?: boolean
  rows?: number
  className?: string
}

export function AutoSizeTextField({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  rows = 3,
  className = ''
}: AutoSizeTextFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={`resize-none overflow-hidden ${className}`}
    />
  )
}
