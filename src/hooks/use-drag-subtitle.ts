import { useRef, useEffect } from 'react'
import { subtitleDefaults, subtitleConstraints } from '../config/subtitle-config'
import { isMobileScreen } from '../utils/helpers'

// Đổi tên biến cho đúng bản chất: lưu trữ giá trị của translateY
let _translateY: number = subtitleDefaults.offsetY

export function getSubtitleTranslateY(): number {
  return _translateY
}

export function applyTranslateYToDOM(value: number): void {
  const el = document.querySelector<HTMLElement>(
    '.NAME-subtitle-overlay' + (isMobileScreen() ? '.NAME-mobile' : '.NAME-desktop')
  )

  if (el) {
    // Tùy logic bạn muốn giới hạn kéo lên/xuống mà dùng Min/Max phù hợp
    // Ví dụ: giới hạn không cho kéo lên quá offsetYMin
    const clamped = Math.min(subtitleConstraints.offsetYMin, value)
    el.style.transform = `translateY(${clamped}px)`
    _translateY = clamped
  }
}

export function moveSubtitleUp(): void {
  // Di chuyển lên tức là translateY giảm (âm)
  console.log('>>> _translateY 1:', _translateY)
  applyTranslateYToDOM(_translateY - subtitleConstraints.translateStep)
}

export function moveSubtitleDown(): void {
  // Di chuyển xuống tức là translateY tăng (dương)
  console.log('>>> _translateY 2:', _translateY)
  applyTranslateYToDOM(_translateY + subtitleConstraints.translateStep)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDragSubtitle() {
  const dragRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const startYRef = useRef(0)

  useEffect(() => {
    const dragEl = dragRef.current
    if (!dragEl) return

    let currentDeltaY = 0

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true
      startYRef.current = e.clientY
      currentDeltaY = 0

      dragEl.setPointerCapture(e.pointerId)
      e.preventDefault()
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return
      currentDeltaY = e.clientY - startYRef.current

      // FIX LỖI GIẬT VỊ TRÍ: Cộng dồn delta hiện tại với vị trí đã lưu trước đó
      const nextY = _translateY + currentDeltaY
      dragEl.style.transform = `translateY(${nextY}px)`
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      dragEl.releasePointerCapture(e.pointerId)

      // FIX LỖI NHẦM DẤU: Lưu lại vị trí bằng phép cộng
      const clamped = _translateY + currentDeltaY
      _translateY = clamped

      // Đảm bảo DOM chốt cứng ở vị trí cuối cùng
      dragEl.style.transform = `translateY(${clamped}px)`
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
  }, [])

  return { dragRef }
}
