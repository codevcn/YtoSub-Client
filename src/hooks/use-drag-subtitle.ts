import { useRef, useEffect } from 'react'
import { subtitleDefaults, subtitleConstraints } from '../config/subtitle-config'
import { isMobileScreen } from '../utils/helpers'

// Biến module lưu vị trí hiện tại
let _bottomPx: number = subtitleDefaults.offsetY

export function getSubtitleBottom(): number {
  return _bottomPx
}

// Hàm này dùng cho các nút bấm Up/Down trong Panel
export function applyBottomToDOM(value: number): void {
  // Tạm chấp nhận querySelector cho các nút bấm vì nó không kích hoạt liên tục
  const el = document.querySelector(
    '.NAME-subtitle-overlay' + (isMobileScreen() ? '.NAME-mobile' : '.NAME-desktop')
  ) as HTMLElement | null
  if (el) {
    const clamped = Math.max(subtitleConstraints.offsetYMin, Math.min(subtitleConstraints.offsetYMax, value))
    el.style.transform = `translateY(${clamped}px)`
    _bottomPx = clamped
  }
}

export function moveSubtitleUp(): void {
  applyBottomToDOM(_bottomPx - subtitleConstraints.translateStep)
}

export function moveSubtitleDown(): void {
  applyBottomToDOM(_bottomPx + subtitleConstraints.translateStep)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

// Nhận outerRef từ component để thao tác DOM trực tiếp mà không cần querySelector
export function useDragSubtitle() {
  const dragRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const startYRef = useRef(0)

  useEffect(() => {
    const dragEl = dragRef.current
    console.log('>>> drag El:', dragEl)
    if (!dragEl) return

    let currentDeltaY = 0

    const onPointerDown = (e: PointerEvent) => {
      console.log('>>> run this down')
      isDraggingRef.current = true
      startYRef.current = e.clientY
      currentDeltaY = 0

      dragEl.setPointerCapture(e.pointerId)
      e.preventDefault()
    }

    const onPointerMove = (e: PointerEvent) => {
      console.log('>>> run this move')
      if (!isDraggingRef.current) return
      currentDeltaY = e.clientY - startYRef.current

      // TỐI ƯU: Chỉ dùng GPU transform trong lúc kéo, không can thiệp Layout (bottom)
      dragEl.style.transform = `translateY(${currentDeltaY}px)`
    }

    const onPointerUp = (e: PointerEvent) => {
      console.log('>>> run this up')
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      dragEl.releasePointerCapture(e.pointerId)

      // 1. Tính toán vị trí bottom mới sau khi thả tay
      const nextBottom = _bottomPx - currentDeltaY
      const clamped = Math.max(subtitleConstraints.offsetYMin, Math.min(subtitleConstraints.offsetYMax, nextBottom))

      // 2. Cập nhật biến module
      _bottomPx = clamped
    }

    dragEl.addEventListener('pointerdown', onPointerDown)
    dragEl.addEventListener('pointermove', onPointerMove)
    dragEl.addEventListener('pointerup', onPointerUp)
    dragEl.addEventListener('pointercancel', onPointerUp)

    return () => {
      dragEl.removeEventListener('pointerdown', onPointerDown)
      dragEl.removeEventListener('pointermove', onPointerMove)
      dragEl.removeEventListener('pointerup', onPointerUp)
      dragEl.removeEventListener('pointercancel', onPointerUp)
    }
  }, []) // Chạy lại effect nếu outerRef thay đổi

  return { dragRef }
}
