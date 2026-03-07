import React, { useState, useRef, useEffect } from 'react'
import { Icon } from '../common/Icon'
import { useSubtitleStore } from '../../store/subtitle-store'
import { subtitleConstraints } from '../../config/subtitle-config'

type PanelView = 'main' | 'font-size' | 'bg-opacity'

const BTN_CLASS =
  'py-1.5 px-2 text-white/80 hover:text-white hover:bg-white/10 active:bg-white/20 rounded-md transition-colors'

type SubtitleCustomPanelProps = {
  showControls?: boolean
}

export function SubtitleCustomPanel({ showControls = false }: SubtitleCustomPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<PanelView>('main')
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)
  const [showButton, setShowButton] = useState(showControls)

  useEffect(() => {
    setShowButton(showControls)
  }, [showControls])

  const subtitleOffsetY = useSubtitleStore(s => s.subtitleOffsetY)
  const subtitleFontSize = useSubtitleStore(s => s.subtitleFontSize)
  const subtitleBgOpacity = useSubtitleStore(s => s.subtitleBgOpacity)
  const setSubtitleOffsetY = useSubtitleStore(s => s.setSubtitleOffsetY)
  const setSubtitleFontSize = useSubtitleStore(s => s.setSubtitleFontSize)
  const setSubtitleBgOpacity = useSubtitleStore(s => s.setSubtitleBgOpacity)

  const handleSwipeTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0]
    touchStartXRef.current = touch.clientX
    touchStartYRef.current = touch.clientY
  }

  const handleSwipeTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartXRef.current
    const deltaY = Math.abs(touch.clientY - touchStartYRef.current)
    touchStartXRef.current = null
    touchStartYRef.current = null
    if (deltaX >= 50 && deltaY < deltaX) {
      openPanel()
    }
  }

  const openPanel = () => {
    setIsOpen(true)
    setView('main')
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleMoveUp = () => {
    setSubtitleOffsetY(Math.min(subtitleOffsetY + 1, subtitleConstraints.offsetYMax))
  }

  const handleMoveDown = () => {
    setSubtitleOffsetY(Math.max(subtitleOffsetY - 1, subtitleConstraints.offsetYMin))
  }

  const handleOpenFontSize = () => setView('font-size')
  const handleOpenBgOpacity = () => setView('bg-opacity')
  const handleBack = () => setView('main')

  const handleFontIncrease = () => {
    setSubtitleFontSize(Math.min(subtitleFontSize + 1, subtitleConstraints.fontSizeMax))
  }

  const handleFontDecrease = () => {
    setSubtitleFontSize(Math.max(subtitleFontSize - 1, subtitleConstraints.fontSizeMin))
  }

  const handleOpacityIncrease = () => {
    const next = parseFloat((subtitleBgOpacity + subtitleConstraints.bgOpacityStep).toFixed(1))
    setSubtitleBgOpacity(Math.min(next, subtitleConstraints.bgOpacityMax))
  }

  const handleOpacityDecrease = () => {
    const next = parseFloat((subtitleBgOpacity - subtitleConstraints.bgOpacityStep).toFixed(1))
    setSubtitleBgOpacity(Math.max(next, subtitleConstraints.bgOpacityMin))
  }

  return (
    <>
      {/* Left-edge swipe detection strip (touch devices) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-10 z-20"
        onTouchStart={handleSwipeTouchStart}
        onTouchEnd={handleSwipeTouchEnd}
      />

      {/* Visible tab handle — click to open (all devices) */}
      {!isOpen && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-(--main-cl) hover:bg-(--main-cl-hover) active:bg-(--main-cl-hover) text-black hover:text-white transition-colors rounded-r-md"
          style={{ padding: '14px 3px', display: showButton ? 'block' : 'none' }}
          onClick={openPanel}
          title="Subtitle settings"
        >
          <Icon name="chevron-right" size={22} />
        </button>
      )}

      {/* Backdrop — click outside panel to close */}
      {isOpen && <div className="absolute inset-0 z-20" onClick={handleClose} />}

      {/* Panel — slides in from the left */}
      <div
        className={`absolute left-0 top-0 bottom-0 z-30 transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full w-14 bg-black/75 backdrop-blur-sm border-r border-white/10 flex flex-col items-center gap-1.5 py-2">
          {/* Close button */}
          <button
            className="py-1.5 px-2 text-white hover:text-white hover:bg-white/10 rounded-md transition-colors"
            onClick={handleClose}
            title="Close"
          >
            <Icon name="close" size={20} />
          </button>

          <div className="w-8 h-px bg-white/20 shrink-0" />

          {/* Main panel view */}
          {view === 'main' && (
            <>
              <button className={BTN_CLASS} onClick={handleMoveUp} title="Move subtitle up">
                <Icon name="arrow-up" size={20} />
              </button>

              <button className={BTN_CLASS} onClick={handleMoveDown} title="Move subtitle down">
                <Icon name="arrow-down" size={20} />
              </button>

              <div className="w-8 h-px bg-white/20 shrink-0" />

              <button
                className={`${BTN_CLASS} text-base font-bold leading-none`}
                onClick={handleOpenFontSize}
                title="Font size"
              >
                Aa
              </button>

              <button className={BTN_CLASS} onClick={handleOpenBgOpacity} title="Background opacity">
                <Icon name="bg-opacity" size={20} />
              </button>
            </>
          )}

          {/* Font size sub-panel */}
          {view === 'font-size' && (
            <>
              <button
                className={`${BTN_CLASS} text-3xl font-bold leading-none`}
                onClick={handleFontIncrease}
                title="Increase font size"
              >
                +
              </button>

              <span className="text-white/80 text-xs text-center leading-tight select-none">{subtitleFontSize}px</span>

              <button
                className={`${BTN_CLASS} text-3xl font-bold leading-none`}
                onClick={handleFontDecrease}
                title="Decrease font size"
              >
                -
              </button>

              <button
                className="mt-auto py-1.5 px-2 text-white hover:text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={handleBack}
                title="Back"
              >
                <Icon name="chevron-left" size={20} />
              </button>
            </>
          )}

          {/* Background opacity sub-panel */}
          {view === 'bg-opacity' && (
            <>
              <button
                className={`${BTN_CLASS} text-3xl font-bold leading-none`}
                onClick={handleOpacityIncrease}
                title="Increase background opacity"
              >
                +
              </button>

              <span className="text-white/80 text-xs text-center leading-tight select-none">
                <span>{Math.round(subtitleBgOpacity * 100)}</span>%
              </span>

              <button
                className={`${BTN_CLASS} text-3xl font-bold leading-none`}
                onClick={handleOpacityDecrease}
                title="Decrease background opacity"
              >
                -
              </button>

              <button
                className="mt-auto py-1.5 px-2 text-white hover:text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={handleBack}
                title="Back"
              >
                <Icon name="chevron-left" size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
