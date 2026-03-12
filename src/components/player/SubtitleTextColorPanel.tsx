import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Popover } from '../common/Popover'
import { subtitleDefaults } from '../../config/subtitle-config'

// ─── Module-level state (tương tự _translateY trong use-drag-subtitle.ts) ──────

let _textColor: string = subtitleDefaults.textColor

export function getSubtitleTextColor(): string {
  return _textColor
}

export function applyTextColorToDOM(color: string): void {
  // Cập nhật cả mobile lẫn desktop subtitle text (cả hai cùng tồn tại trong DOM)
  const els = document.body.querySelectorAll<HTMLElement>('.NAME-subtitle-text')
  els.forEach(el => {
    el.style.color = color
  })
  _textColor = color
}

// ─── Component ─────────────────────────────────────────────────────────────────

type SubtitleTextColorPanelProps = {
  btnClassName: string
}

function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value)
}

export function SubtitleTextColorPanel({ btnClassName }: SubtitleTextColorPanelProps) {
  const [color, setColor] = useState(_textColor)
  const [hexInput, setHexInput] = useState(_textColor)

  const handlePickerChange = (newColor: string) => {
    setColor(newColor)
    setHexInput(newColor)
    applyTextColorToDOM(newColor)
  }

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setHexInput(value)
    if (isValidHex(value)) {
      setColor(value)
      applyTextColorToDOM(value)
    }
  }

  return (
    <Popover
      trigger={
        <div className={btnClassName} title="Màu chữ phụ đề">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {/* Chữ "A" */}
            <path
              d="M5 18 L12 5 L19 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M8 13 h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Thanh màu hiển thị màu hiện tại */}
            <rect x="2" y="21" width="20" height="4" rx="1" fill={color} />
          </svg>
        </div>
      }
      position="bottom"
      closeBtnSize={20}
    >
      <div className="flex flex-col gap-3">
        <HexColorPicker color={color} onChange={handlePickerChange} />
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border border-zinc-300 dark:border-zinc-600 shrink-0"
            style={{ background: color }}
          />
          <input
            type="text"
            value={hexInput}
            onChange={handleHexInputChange}
            className="flex-1 min-w-0 text-sm font-mono bg-zinc-100 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-(--main-cl)"
            maxLength={7}
            spellCheck={false}
            placeholder="#ffffff"
          />
        </div>
      </div>
    </Popover>
  )
}
