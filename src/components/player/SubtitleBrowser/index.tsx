import React, { useState, useEffect, useCallback, useRef } from 'react'
import { isAxiosError } from 'axios'
import { Icon } from '../../common/Icon'
import { LoadingDots } from '../../common/Loading'
import { subtitleService } from '../../../services/subtitle.service'
import type { SubtitleListItem } from '../../../services/subtitle.service'
import { parseSRT } from '../../../utils/parse-SRT'
import { useSubtitleStore } from '../../../store/subtitle-store'
import { AxiosErrorHandler } from '../../../utils/axios-error-handler'
import { toast } from '../../../utils/toast-store'
import { SUBTITLES_PAGE_SIZE } from '../../../utils/constants'
import type { BrowserStatus, SearchArgs } from './subtitle-browser-types'
import { extractVideoId, resolveTimeFrom, resolveTimeTo, FROM_OPTIONS, TO_OPTIONS } from './subtitle-browser-types'
import { SubtitleCard } from './SubtitleCard'
import { PaginationBar } from './PaginationBar'
import { PrivateSubtitlePopup } from './PrivateSubtitlePopup'
import { SubtitleContentSection } from './SubtitleContentSection'

type SubtitleBrowserProps = {
  videoUrl: string
}

export function SubtitleBrowser({ videoUrl }: SubtitleBrowserProps) {
  const setSubtitles = useSubtitleStore(state => state.setSubtitles)
  const loadedSubtitleMeta = useSubtitleStore(state => state.appliedSubtitleMeta)
  const setLoadedSubtitleMeta = useSubtitleStore(state => state.setAppliedSubtitleMeta)
  
  const [usernameFilter, setUsernameFilter] = useState('')
  const [timeFromPreset, setTimeFromPreset] = useState('')
  const [timeToPreset, setTimeToPreset] = useState('')
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<SubtitleListItem[]>([])
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(SUBTITLES_PAGE_SIZE)
  const [status, setStatus] = useState<BrowserStatus>('loading')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<SubtitleListItem | null>(null)
  const [applyPassword, setApplyPassword] = useState('')
  const [applyStatus, setApplyStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [applyingPublicId, setApplyingPublicId] = useState<number | null>(null)
  const [publicApplyError, setPublicApplyError] = useState<string | null>(null)
  const [appliedItemId, setAppliedItemId] = useState<number | null>(null)
  const contentSectionRef = useRef<HTMLDivElement>(null)

  const videoId = extractVideoId(videoUrl)

  const fetchList = useCallback(async (args: SearchArgs) => {
    setStatus('loading')
    setErrorMsg(null)
    try {
      const res = await subtitleService.listSubtitles({
        video_id: args.videoId,
        username: args.username.trim() || null,
        time_from: resolveTimeFrom(args.timeFromPreset),
        time_to: resolveTimeTo(args.timeToPreset),
        page: args.page
      })
      setItems(res.items)
      setTotal(res.total)
      setPageSize(res.page_size)
      setStatus('done')
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 404) {
        setItems([])
        setTotal(0)
        setStatus('done')
      } else {
        setErrorMsg('Có lỗi xảy ra khi tải danh sách phụ đề.')
        setStatus('error')
      }
    }
  }, [])

  useEffect(() => {
    if (!videoId) return
    setUsernameFilter('')
    setTimeFromPreset('')
    setTimeToPreset('')
    setPage(1)
    fetchList({ videoId, username: '', timeFromPreset: '', timeToPreset: '', page: 1 })
  }, [videoId, fetchList])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameFilter(e.target.value)
  }

  const handleTimeFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFromPreset(e.target.value)
  }

  const handleTimeToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeToPreset(e.target.value)
  }

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!videoId) return
    setPage(1)
    fetchList({ videoId, username: usernameFilter, timeFromPreset, timeToPreset, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    if (!videoId) return
    setPage(newPage)
    fetchList({ videoId, username: usernameFilter, timeFromPreset, timeToPreset, page: newPage })
  }

  const fetchAndApply = useCallback(
    async (item: SubtitleListItem, password: string | null) => {
      const isPrivate = !item.is_public
      if (isPrivate) {
        setApplyStatus('loading')
      } else {
        setApplyingPublicId(item.id)
        setPublicApplyError(null)
      }
      try {
        const content = await subtitleService.getSubtitleContent(item.id, password)
        const subtitles = parseSRT(content)
        if (subtitles.length === 0) {
          const msg = 'Định dạng phụ đề trong file không phù hợp.'
          if (isPrivate) {
            setApplyStatus('error')
            toast.error(msg)
          } else {
            setPublicApplyError(msg)
            setApplyingPublicId(null)
          }
          return
        }
        setSubtitles(subtitles)
        setAppliedItemId(item.id)
        setLoadedSubtitleMeta({ item, subtitles })
        if (isPrivate) {
          setSelectedItem(null)
          setApplyPassword('')
          setApplyStatus('idle')
        } else {
          setApplyingPublicId(null)
        }
        // Cuộn xuống section nội dung phụ đề
        setTimeout(() => {
          contentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      } catch (err) {
        let msg = 'Không thể tải nội dung phụ đề.'
        if (isAxiosError(err)) {
          msg = AxiosErrorHandler.handleError(err).message
        } else if (err instanceof Error) {
          msg = err.message
        }
        if (isPrivate) {
          setApplyStatus('error')
          toast.error(msg)
        } else {
          setPublicApplyError(msg)
          setApplyingPublicId(null)
        }
      }
    },
    [setSubtitles]
  )

  const handleCardSelect = (item: SubtitleListItem) => {
    if (item.is_public) {
      fetchAndApply(item, null)
    } else {
      setSelectedItem(item)
      setApplyPassword('')
      setApplyStatus('idle')
    }
  }

  const handleClosePrivatePopup = () => {
    setSelectedItem(null)
    setApplyPassword('')
    setApplyStatus('idle')
  }

  const handlePrivatePanelClick = (e: React.MouseEvent) => e.stopPropagation()

  const handleApplyPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApplyPassword(e.target.value)
  }

  const handlePrivateApplySubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedItem) return
    fetchAndApply(selectedItem, applyPassword)
  }

  if (!videoId) return null

  const totalPages = Math.ceil(total / pageSize)

  const selectCls =
    'grow h-9 px-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-(--main-cl) transition'

  return (
    <div className="w-full max-w-full px-2 desktop:px-4 mx-auto mt-6 flex flex-col gap-5">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <Icon name="search" size={15} className="text-(--main-cl)" />
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Phụ đề trên server</span>
          {status === 'done' && total > 0 && (
            <span className="text-xs text-zinc-400 dark:text-zinc-500">· {total} kết quả</span>
          )}
        </div>
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
      </div>

      {/* Filter form */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0 select-none">Từ</label>
          <select value={timeFromPreset} onChange={handleTimeFromChange} aria-label="Từ ngày" className={selectCls}>
            {FROM_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0 select-none">Đến</label>
          <select value={timeToPreset} onChange={handleTimeToChange} aria-label="Đến ngày" className={selectCls}>
            {TO_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={usernameFilter}
          onChange={handleUsernameChange}
          placeholder="Lọc theo username..."
          className={`${selectCls} min-w-36 placeholder-zinc-400`}
        />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="h-9 px-5 bg-(--main-cl) hover:bg-(--main-cl-hover) text-zinc-950 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          Tìm kiếm
        </button>
      </form>

      {/* Loading */}
      {status === 'loading' && (
        <div className="flex items-center justify-center py-16">
          <LoadingDots />
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm border border-red-100 dark:border-red-900/30">
          <Icon name="info" size={15} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Empty */}
      {status === 'done' && items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Icon name="file-text" size={40} className="text-zinc-300 dark:text-zinc-700" />
          <p className="text-sm text-zinc-400 dark:text-zinc-500">Chưa có phụ đề nào cho video này.</p>
        </div>
      )}

      {/* Grid */}
      {status === 'done' && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map(item => (
            <SubtitleCard
              key={item.id}
              item={item}
              isApplying={applyingPublicId === item.id}
              onSelect={handleCardSelect}
              isSelected={appliedItemId === item.id}
            />
          ))}
        </div>
      )}

      {/* Public apply error */}
      {publicApplyError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm border border-red-100 dark:border-red-900/30">
          <Icon name="info" size={15} className="shrink-0" />
          <span>{publicApplyError}</span>
        </div>
      )}

      {/* Pagination */}
      {status === 'done' && totalPages > 1 && (
        <PaginationBar page={page} total={total} pageSize={pageSize} onPageChange={handlePageChange} />
      )}

      {/* Loaded subtitle content section */}
      {loadedSubtitleMeta && (
        <div ref={contentSectionRef} id="preview-content-section-ref">
          <SubtitleContentSection meta={loadedSubtitleMeta} onClose={() => setLoadedSubtitleMeta(null)} />
        </div>
      )}

      {/* Private subtitle password popup */}
      {selectedItem && (
        <PrivateSubtitlePopup
          item={selectedItem}
          password={applyPassword}
          applyStatus={applyStatus}
          onPasswordChange={handleApplyPasswordChange}
          onApplySubmit={handlePrivateApplySubmit}
          onClose={handleClosePrivatePopup}
          onBackdropClick={handleClosePrivatePopup}
          onPanelClick={handlePrivatePanelClick}
        />
      )}
    </div>
  )
}
