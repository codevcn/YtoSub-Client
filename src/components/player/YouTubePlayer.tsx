import { Icon } from '../common/Icon'
import { DesktopPlayer } from './DesktopPlayer'
import { MobilePlayer } from './MobilePlayer'
import { useSubtitleStore } from '../../store/subtitle-store'

type YouTubePlayerProps = {
  url: string
}

export function YouTubePlayer({ url }: YouTubePlayerProps) {
  const subtitles = useSubtitleStore(state => state.subtitles)

  if (!url) {
    return (
      <div className="w-full aspect-video bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 shadow-lg overflow-hidden relative">
        <div className="text-zinc-500 flex flex-col items-center gap-3 relative z-10 p-6 text-center">
          <Icon name="play" size={48} className="opacity-50" />
          <p className="text-lg pb-1">Enter a YouTube URL to start playing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center w-full mt-4">
      <MobilePlayer url={url} subtitles={subtitles} />
      <DesktopPlayer url={url} subtitles={subtitles} />
    </div>
  )
}
