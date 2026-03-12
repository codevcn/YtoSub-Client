import React, { useState, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'

export type ColorPickerProps = {
  /** Giá trị mã màu Hex hiện tại (ví dụ: #FF0000) */
  color: string
  /** Callback được gọi khi màu sắc thay đổi */
  onChange: (color: string) => void
  /** Class CSS bổ sung để custom từ bên ngoài */
  className?: string
}

const HEX_REGEX = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i

export function ColorPicker({ color, onChange, className = '' }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(color)

  // Đồng bộ giá trị input khi prop `color` thay đổi từ bên ngoài (hoặc được kéo chọn)
  useEffect(() => {
    setInputValue(color)
  }, [color])

  // Xử lý khi người dùng gõ vào ô input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)

    // Chỉ tự động cập nhật picker khi mã hex hợp lệ
    if (HEX_REGEX.test(val)) {
      onChange(val.startsWith('#') ? val : `#${val}`)
    }
  }

  // Xử lý khi blur: nếu nhập sai format hoặc bỏ trống sẽ reset lại màu cũ
  const handleBlur = () => {
    if (!HEX_REGEX.test(inputValue)) {
      setInputValue(color)
    }
  }

  return (
    <div className={`flex flex-col gap-3 p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm ${className}`}>
      {/* 
        react-colorful HexColorPicker 
        Mặc định thư viện sẽ style inline width 100% khi ta pass class w-full
      */}
      <div className="w-full h-40 [&_.react-colorful]:w-full [&_.react-colorful]:h-full">
        <HexColorPicker color={color} onChange={onChange} />
      </div>

      {/* Input hiển thị và nhập mã Hex */}
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 shrink-0 shadow-sm"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="flex-1 h-9 px-3 font-mono text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-(--main-cl) transition-shadow"
          placeholder="#000000"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
