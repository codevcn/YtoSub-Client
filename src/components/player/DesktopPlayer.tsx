import { useState, useRef, useEffect } from 'react'
import React from 'react'
import ReactPlayer from 'react-player'
import { SubtitleOverlay } from './SubtitleOverlay'
import { SubtitleCustomPanel } from './SubtitleCustomPanel'
import type { Subtitle } from '../../types/global'
import { Icon } from '../common/Icon'
import { useSubtitleStore } from '../../store/subtitle-store'

type DesktopPlayerProps = {
  url: string
  subtitles: Subtitle[]
}

export function DesktopPlayer({ url, subtitles }: DesktopPlayerProps) {
  const setCurrentTime = useSubtitleStore(s => s.setCurrentTime)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showUploadSubWarn, setShowUploadSubWarn] = useState(true)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime)
  }

  const handleFullscreenToggle = () => {
    if (isFullscreen) {
      document.exitFullscreen()
    } else {
      containerRef.current?.requestFullscreen()
    }
  }

  return (
    <div
      ref={containerRef}
      className={`desktop:block hidden relative h-[calc(100vh-18px)] aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group border border-zinc-800`}
    >
      <ReactPlayer
        src={url}
        width="100%"
        height="100%"
        controls={true}
        onTimeUpdate={handleTimeUpdate}
        config={{
          youtube: {
            rel: 0,
            fs: 0
          }
        }}
      />

      {subtitles.length > 0 ? (
        <SubtitleOverlay subtitles={subtitles} deviceType="desktop" />
      ) : (
        showUploadSubWarn && (
          <div
            onClick={() => setShowUploadSubWarn(false)}
            className="flex items-center gap-1 cursor-pointer hover:bg-red-600/80 absolute top-3 right-3 bg-red-600/50 backdrop-blur-md px-2 py-1 rounded-md text-md text-white/80 border border-white/10"
          >
            <Icon name={'close'} size={22} />
            <span>Chưa tải lên phụ đề</span>
          </div>
        )
      )}

      <SubtitleCustomPanel showControls={undefined} />

      <button
        onClick={handleFullscreenToggle}
        title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
        className="hidden group-hover:block absolute bottom-1 right-3 z-20 cursor-pointer bg-(--main-cl) hover:bg-(--main-cl-hover) backdrop-blur-md text-black rounded-md p-1.5 transition-opacity duration-200 border border-white/30"
      >
        <Icon name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'} size={19} />
      </button>
    </div>
  )
}
