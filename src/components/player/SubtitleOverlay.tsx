import type { DeviceType, Subtitle } from '../../types/global'
import { subtitleDefaults } from '../../config/subtitle-config'
import { findSubtitleByTime } from '../../utils/algorithms'
import { useSubtitleStore } from '../../store/subtitle-store'
import { useDragSubtitle } from '../../hooks/use-drag-subtitle'

type SubtitleOverlayProps = {
  subtitles: Subtitle[]
  deviceType: DeviceType
}

export function SubtitleOverlay({ subtitles, deviceType }: SubtitleOverlayProps) {
  const currentTime = useSubtitleStore(s => s.currentTime)
  const subtitleFontSize = useSubtitleStore(s => s.subtitleFontSize)
  const subtitleBgOpacity = useSubtitleStore(s => s.subtitleBgOpacity)

  // TRUYỀN outerRef VÀO HOOK
  const { dragRef } = useDragSubtitle()

  const currentSubtitle = findSubtitleByTime(subtitles, currentTime)

  const { padding, offsetY } = subtitleDefaults

  return (
    <div
      ref={dragRef}
      className={`NAME-${deviceType} NAME-subtitle-overlay absolute bottom-3 left-0 right-0 w-full justify-center pointer-events-none z-10`}
      style={{ transform: `translateY(${offsetY}px)`, display: currentSubtitle ? 'flex' : 'none' }}
    >
      <div
        className="text-white text-center rounded max-w-[90%] md:max-w-[70%] lg:max-w-[60%] will-change-transform pointer-events-auto cursor-grab active:cursor-grabbing select-none"
        style={{
          fontSize: `${subtitleFontSize}px`,
          background: `rgba(0,0,0,${subtitleBgOpacity})`,
          padding: padding,
          fontFamily: 'var(--font-sans)',
          textShadow: '0px 1px 2px rgba(0,0,0,0.8)',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.4'
        }}
        dangerouslySetInnerHTML={{ __html: currentSubtitle?.text || '' }}
      />
    </div>
  )
}
