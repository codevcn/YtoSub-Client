import React from 'react'
import { Icon } from '../../common/Icon'
import { LoadingDots } from '../../common/Loading'
import type { SubtitleListItem } from '../../../services/subtitle.service'
import { extractFilename } from './subtitle-browser-types'

type PrivateSubtitlePopupProps = {
  item: SubtitleListItem
  password: string
  applyStatus: 'idle' | 'loading' | 'error'
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onApplySubmit: (e: React.SubmitEvent<HTMLFormElement>) => void
  onClose: () => void
  onBackdropClick: () => void
  onPanelClick: (e: React.MouseEvent) => void
}

export function PrivateSubtitlePopup({
  item,
  password,
  applyStatus,
  onPasswordChange,
  onApplySubmit,
  onClose,
  onBackdropClick,
  onPanelClick
}: PrivateSubtitlePopupProps) {
  const filename = extractFilename(item.file_path)
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onBackdropClick}
    >
      <div
        className="w-full max-w-sm flex flex-col bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
        onClick={onPanelClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-2 min-w-0">
            <Icon name="lock" size={15} className="text-zinc-500 dark:text-zinc-400 shrink-0" />
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">File riêng tư</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shrink-0"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* File info */}
        <div className="px-5 pt-4 pb-2">
          <p className="font-mono text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate" title={filename}>
            {filename}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">bởi {item.username}</p>
        </div>

        {/* Form */}
        <form onSubmit={onApplySubmit} className="px-5 py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="private-subtitle-pw" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Mật khẩu
            </label>
            <div className="relative">
              <Icon
                name="lock"
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <input
                id="private-subtitle-pw"
                type="password"
                value={password}
                onChange={onPasswordChange}
                placeholder="Nhập mật khẩu..."
                autoFocus
                className="w-full h-9 pl-8 pr-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-(--main-cl) transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={applyStatus === 'loading'}
            className="w-full flex items-center justify-center gap-2 h-11 border-2 border-(--main-cl) text-(--main-cl) hover:bg-(--main-cl)/10 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {applyStatus === 'loading' ? (
              <LoadingDots />
            ) : (
              <>
                <Icon name="check" size={17} />
                <span>Áp dụng phụ đề</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
