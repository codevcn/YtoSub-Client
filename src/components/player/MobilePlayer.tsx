import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { SubtitleOverlay } from './SubtitleOverlay'
import { SubtitleCustomPanel } from './SubtitleCustomPanel'
import type { Subtitle } from '../../types/global'
import { Icon } from '../common/Icon'
import { useSubtitleStore } from '../../store/subtitle-store'

type MobilePlayerProps = {
  url: string
  subtitles: Subtitle[]
}

export function MobilePlayer({ url, subtitles }: MobilePlayerProps) {
  const setCurrentTime = useSubtitleStore(s => s.setCurrentTime)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPlayingRef = useRef(false)
  const [showUploadSubWarn, setShowUploadSubWarn] = useState(true)

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000)
  }

  const showControlsPermanently = () => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    setShowControls(true)
  }

  useEffect(() => {
    // Khi user tap vào YouTube iframe, window mất focus → hiển thị nút nếu đang phát
    const handleWindowBlur = () => {
      showControlsTemporarily()
    }
    window.addEventListener('blur', handleWindowBlur)
    return () => {
      window.removeEventListener('blur', handleWindowBlur)
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    }
  }, [])

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime)
  }

  const handlePlay = () => {
    isPlayingRef.current = true
    showControlsTemporarily()
  }

  const handlePause = () => {
    isPlayingRef.current = false
    showControlsPermanently()
  }

  const handleEnded = () => {
    isPlayingRef.current = false
    showControlsPermanently()
  }

  const handleFullscreenToggle = () => {
    if (isFullscreen) {
      document.exitFullscreen()
      setIsFullscreen(false)
    } else {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    }
  }

  return (
    <div className={`mobile:hidden flex w-full ${isFullscreen ? '' : 'px-6'}`} ref={containerRef}>
      <div
        className={'relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800'}
      >
        <ReactPlayer
          src={url}
          width="100%"
          height="100%"
          controls={true}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          config={{
            youtube: {
              rel: 0,
              fs: 0
            }
          }}
        />

        {subtitles.length > 0 ? (
          <SubtitleOverlay subtitles={subtitles} />
        ) : (
          showUploadSubWarn && (
            <div
              onClick={() => setShowUploadSubWarn(false)}
              className="flex items-center gap-1 absolute top-3 right-3 bg-red-600/50 backdrop-blur-md px-2 py-1 rounded-md text-xs text-white/80 border border-white/10"
            >
              <Icon name={'close'} size={16} />
              <span>Chưa tải lên phụ đề</span>
            </div>
          )
        )}

        <SubtitleCustomPanel showControls={showControls} />

        {/* Nút mở rộng / thu nhỏ — luôn hiển thị trên mobile */}
        <button
          onClick={handleFullscreenToggle}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          className={`${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${isFullscreen ? 'bottom-21' : 'bottom-14'} NAME-custom-fullscreen-button absolute right-2 z-20 bg-(--main-cl) active:bg-(--main-cl-hover) text-black rounded-md p-2 border`}
        >
          <Icon name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'} size={22} />
        </button>
      </div>
    </div>
  )
}
