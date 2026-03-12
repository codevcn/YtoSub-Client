import { Icon } from '../../common/Icon'
import { LoadingDots } from '../../common/Loading'
import type { SubtitleListItem } from '../../../services/subtitle.service'
import { extractFilename, formatDate } from './subtitle-browser-types'

type SubtitleCardProps = {
  item: SubtitleListItem
  isApplying: boolean
  onSelect: (item: SubtitleListItem) => void
  isSelected?: boolean
}

export function SubtitleCard({ item, isApplying, onSelect, isSelected }: SubtitleCardProps) {
  const filename = extractFilename(item.file_path)
  const handleClick = () => onSelect(item)
  return (
    <div
      onClick={handleClick}
      style={isApplying ? { pointerEvents: 'none', cursor: 'not-allowed' } : {}}
      className={`${isSelected ? 'outline-2 outline-(--main-cl) border-(--main-cl)' : ''} flex flex-col gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:outline-2 outline-(--main-cl) hover:shadow-sm transition-all text-left w-full relative cursor-pointer disabled:cursor-not-allowed`}
    >
      <div className="flex items-start gap-2">
        <Icon name="file-text" size={14} className="text-(--main-cl) shrink-0 mt-0.5" />
        <p
          className="font-mono text-xs font-medium text-zinc-800 dark:text-zinc-100 break-all leading-snug line-clamp-2"
          title={filename}
        >
          {filename}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 min-w-0">
          <Icon name="user" size={12} className="shrink-0" />
          <span className="truncate">{item.username}</span>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold ${
            item.is_public
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
          }`}
        >
          {item.is_public ? <Icon name="globe" size={12} /> : <Icon name="lock" size={12} />}
          {item.is_public ? 'Công khai' : 'Riêng tư'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
        <Icon name="calendar" size={12} className="shrink-0" />
        <span>{formatDate(item.created_at)}</span>
      </div>

      {isApplying && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80 dark:bg-zinc-900/80">
          <LoadingDots dotStyle={{ backgroundColor: 'var(--main-cl)' }} />
        </div>
      )}

      {isSelected && (
        <div className="rounded-tl-xl rounded-br-xl bottom-0 right-0 absolute text-black bg-(--main-cl) text-xs font-bold px-2 py-1">
          Đã áp dụng
        </div>
      )}
    </div>
  )
}
