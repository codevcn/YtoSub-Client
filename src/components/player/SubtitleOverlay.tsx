import type { Subtitle } from '../../types/global'
import { subtitleConfig } from '../../config/subtitle-config'
import { findSubtitleByTime } from '../../utils/algorithms'
import { useSubtitleStore } from '../../store/subtitle-store'

type SubtitleOverlayProps = {
  subtitles: Subtitle[]
}

export function SubtitleOverlay({ subtitles }: SubtitleOverlayProps) {
  const currentTime = useSubtitleStore(s => s.currentTime)
  const subtitleOffsetY = useSubtitleStore(s => s.subtitleOffsetY)
  const subtitleFontSize = useSubtitleStore(s => s.subtitleFontSize)
  const subtitleBgOpacity = useSubtitleStore(s => s.subtitleBgOpacity)

  // Find current subtitle
  const currentSubtitle = findSubtitleByTime(subtitles, currentTime)

  if (!currentSubtitle) {
    return null
  }

  const { padding } = subtitleConfig

  return (
    <div
      className="absolute left-0 right-0 w-full flex justify-center pointer-events-none z-10"
      style={{ bottom: `${subtitleOffsetY}px` }}
    >
      <div
        className="text-white text-center rounded max-w-[90%] md:max-w-[70%] lg:max-w-[60%] will-change-transform"
        style={{
          fontSize: `${subtitleFontSize}px`,
          background: `rgba(0,0,0,${subtitleBgOpacity})`,
          padding: padding,
          fontFamily: 'var(--font-sans)',
          textShadow: '0px 1px 2px rgba(0,0,0,0.8)',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.4'
        }}
        dangerouslySetInnerHTML={{ __html: currentSubtitle.text }}
      />
    </div>
  )
}
