import { useRef } from 'react'
import { Icon } from '../../common/Icon'
import type { LoadedSubtitleMeta } from './subtitle-browser-types'
import { extractFilename, formatSeconds } from './subtitle-browser-types'

type SubtitleContentSectionProps = {
  meta: LoadedSubtitleMeta
  onClose: () => void
}

export function SubtitleContentSection({ meta, onClose }: SubtitleContentSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const filename = extractFilename(meta.item.file_path)

  return (
    <div ref={sectionRef} className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <Icon name="file-text" size={15} className="text-(--main-cl)" />
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Nội dung phụ đề</span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">· {meta.subtitles.length} dòng</span>
        </div>
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      {/* File info bar */}
      <div className="flex items-center gap-3 px-3 py-2 bg-zinc-50 dark:bg-zinc-800/60 rounded-lg border border-zinc-200 dark:border-zinc-700">
        <Icon name="user" size={13} className="text-zinc-400 shrink-0" />
        <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{meta.item.username}</span>
        <span className="mx-1 text-zinc-300 dark:text-zinc-600 select-none">·</span>
        <Icon name="file-text" size={13} className="text-zinc-400 shrink-0" />
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">{filename}</span>
      </div>

      {/* Subtitle list */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {meta.subtitles.map((sub, idx) => (
            <div
              key={sub.id ?? idx}
              className="flex gap-3 px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              {/* Index */}
              <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500 w-6 text-right leading-5 select-none">
                {sub.id ?? idx + 1}
              </span>

              {/* Timestamp */}
              <span className="shrink-0 font-mono text-xs text-zinc-400 dark:text-zinc-500 leading-5 whitespace-nowrap">
                {formatSeconds(sub.start)} → {formatSeconds(sub.end)}
              </span>

              {/* Text */}
              <span
                className="text-sm text-zinc-700 dark:text-zinc-200 leading-5 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: sub.text }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
