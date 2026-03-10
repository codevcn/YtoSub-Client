import React, { useState, useEffect, useCallback } from 'react'
import { isAxiosError } from 'axios'
import { Icon } from '../common/Icon'
import { LoadingDots } from '../common/Loading'
import { subtitleService } from '../../services/subtitle.service'
import type { SubtitleListItem } from '../../services/subtitle.service'
import { parseSRT } from '../../utils/parse-SRT'
import { useSubtitleStore } from '../../store/subtitle-store'
import { AxiosErrorHandler } from '../../utils/axios-error-handler'
import { toast } from '../../utils/toast-store'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1).split('?')[0]
    if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v')
  } catch {
    return null
  }
  return null
}

function toISOLocal(date: Date): string {
  const z = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${z(date.getMonth() + 1)}-${z(date.getDate())}T${z(date.getHours())}:${z(date.getMinutes())}:${z(date.getSeconds())}`
}

function resolveTimeFrom(preset: string): string | null {
  if (!preset) return null
  const d = new Date()
  if (preset === 'today') {
    d.setHours(0, 0, 0, 0)
    return toISOLocal(d)
  }
  const days: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }
  if (days[preset] !== undefined) {
    d.setDate(d.getDate() - days[preset])
    d.setHours(0, 0, 0, 0)
    return toISOLocal(d)
  }
  return null
}

function resolveTimeTo(preset: string): string | null {
  if (!preset) return null
  const d = new Date()
  if (preset === 'today_end') {
    d.setHours(23, 59, 59, 0)
    return toISOLocal(d)
  }
  if (preset === 'yesterday_end') {
    d.setDate(d.getDate() - 1)
    d.setHours(23, 59, 59, 0)
    return toISOLocal(d)
  }
  const days: Record<string, number> = { '7d_end': 7, '30d_end': 30 }
  if (days[preset] !== undefined) {
    d.setDate(d.getDate() - days[preset])
    d.setHours(23, 59, 59, 0)
    return toISOLocal(d)
  }
  return null
}

function extractFilename(filePath: string): string {
  return filePath.split(/[/\\]/).pop() ?? filePath
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    const z = (n: number) => String(n).padStart(2, '0')
    return `${z(d.getDate())}/${z(d.getMonth() + 1)}/${d.getFullYear()} ${z(d.getHours())}:${z(d.getMinutes())}`
  } catch {
    return iso
  }
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const result: (number | '...')[] = [1]
  if (current > 3) result.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) result.push(i)
  if (current < total - 2) result.push('...')
  result.push(total)
  return result
}

// ─── Constants ────────────────────────────────────────────────────────────────

type SelectOption = { label: string; value: string }

const FROM_OPTIONS: SelectOption[] = [
  { label: 'Tất cả', value: '' },
  { label: 'Hôm nay', value: 'today' },
  { label: '7 ngày trước', value: '7d' },
  { label: '30 ngày trước', value: '30d' },
  { label: '3 tháng trước', value: '90d' }
]

const TO_OPTIONS: SelectOption[] = [
  { label: 'Hiện tại', value: '' },
  { label: 'Cuối hôm nay', value: 'today_end' },
  { label: 'Cuối hôm qua', value: 'yesterday_end' },
  { label: '7 ngày trước', value: '7d_end' },
  { label: '30 ngày trước', value: '30d_end' }
]

// ─── Types ────────────────────────────────────────────────────────────────────

type BrowserStatus = 'loading' | 'done' | 'error'

type SearchArgs = {
  videoId: string
  username: string
  timeFromPreset: string
  timeToPreset: string
  page: number
}

// ─── SubtitleCard ─────────────────────────────────────────────────────────────

type SubtitleCardProps = {
  item: SubtitleListItem
  isApplying: boolean
  onSelect: (item: SubtitleListItem) => void
  isSelected?: boolean
}

function SubtitleCard({ item, isApplying, onSelect, isSelected }: SubtitleCardProps) {
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
          <LoadingDots />
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

// ─── PageButton ───────────────────────────────────────────────────────────────

type PageButtonProps = {
  pageNum: number
  isActive: boolean
  onPageChange: (page: number) => void
}

function PageButton({ pageNum, isActive, onPageChange }: PageButtonProps) {
  const handleClick = () => onPageChange(pageNum)
  return (
    <button
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center justify-center min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-(--main-cl) text-zinc-950 font-bold'
          : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
      }`}
    >
      {pageNum}
    </button>
  )
}

// ─── PaginationBar ────────────────────────────────────────────────────────────

type PaginationBarProps = {
  page: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

function PaginationBar({ page, total, pageSize, onPageChange }: PaginationBarProps) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const pageNumbers = buildPageNumbers(page, totalPages)
  const navBtnCls =
    'flex items-center justify-center min-w-8 h-8 px-2 rounded-lg text-sm transition-colors text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed'

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1)
  }
  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1)
  }

  return (
    <div className="flex items-center justify-center gap-1 flex-wrap">
      <button onClick={handlePrev} disabled={page <= 1} aria-label="Trang trước" className={navBtnCls}>
        <Icon name="chevron-left" size={16} />
      </button>

      {pageNumbers.map((p, idx) =>
        p === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex items-center justify-center min-w-8 h-8 text-sm text-zinc-400 select-none"
          >
            …
          </span>
        ) : (
          <PageButton key={p} pageNum={p} isActive={p === page} onPageChange={onPageChange} />
        )
      )}

      <button onClick={handleNext} disabled={page >= totalPages} aria-label="Trang sau" className={navBtnCls}>
        <Icon name="chevron-right" size={16} />
      </button>
    </div>
  )
}

// ─── PrivateSubtitlePopup ─────────────────────────────────────────────────────

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

function PrivateSubtitlePopup({
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

// ─── SubtitleBrowser ──────────────────────────────────────────────────────────

type SubtitleBrowserProps = {
  videoUrl: string
}

export function SubtitleBrowser({ videoUrl }: SubtitleBrowserProps) {
  const setSubtitles = useSubtitleStore(state => state.setSubtitles)
  const [usernameFilter, setUsernameFilter] = useState('')
  const [timeFromPreset, setTimeFromPreset] = useState('')
  const [timeToPreset, setTimeToPreset] = useState('')
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<SubtitleListItem[]>([])
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [status, setStatus] = useState<BrowserStatus>('loading')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<SubtitleListItem | null>(null)
  const [applyPassword, setApplyPassword] = useState('')
  const [applyStatus, setApplyStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [applyingPublicId, setApplyingPublicId] = useState<number | null>(null)
  const [publicApplyError, setPublicApplyError] = useState<string | null>(null)
  const [appliedItemId, setAppliedItemId] = useState<number | null>(null)

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
        if (isPrivate) {
          setSelectedItem(null)
          setApplyPassword('')
          setApplyStatus('idle')
        } else {
          setApplyingPublicId(null)
        }
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
    'h-9 px-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-(--main-cl) transition-all'

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 flex flex-col gap-5">
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
          className={`${selectCls} flex-1 min-w-36 placeholder-zinc-400`}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 mobile:grid-cols-3 gap-3">
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
