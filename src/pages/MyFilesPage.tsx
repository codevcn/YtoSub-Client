import { useState } from 'react'
import { Icon } from '../components/common/Icon'
import { downloadFile } from '../utils/download-file'
import { fileService } from '../services/file.service'
import type { SrtFileItem as SrtFile } from '../services/file.service'
import { AxiosErrorHandler } from '../utils/axios-error-handler'
import { isAxiosError } from 'axios'

type PageState = 'idle' | 'loading' | 'done' | 'error'

type PreviewState = {
  file: SrtFile
  content: string | null
  loading: boolean
  error: string | null
} | null

// ─── File item row ─────────────────────────────────────────────────────────

type SrtFileItemProps = {
  file: SrtFile
  isDownloading: boolean
  downloadError: string | null
  onPreview: () => void
  onDownload: () => void
}

function SrtFileItem({ file, isDownloading, downloadError, onPreview, onDownload }: SrtFileItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
        <Icon name="file-text" size={18} className="shrink-0 text-zinc-400" />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300 truncate">{file.filename}</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Video ID: {file.video_id}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onPreview}
            aria-label="Xem trước nội dung"
            title="Xem trước"
            className="p-2 rounded-lg text-zinc-400 hover:text-(--main-cl) hover:bg-(--main-cl)/10 active:bg-(--main-cl)/20 transition-colors"
          >
            <Icon name="eye" size={18} />
          </button>
          <button
            onClick={onDownload}
            disabled={isDownloading}
            aria-label="Tải xuống"
            title="Tải xuống"
            className="p-2 rounded-lg text-zinc-400 hover:text-(--main-cl) hover:bg-(--main-cl)/10 active:bg-(--main-cl)/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-spin"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            ) : (
              <Icon name="download" size={18} />
            )}
          </button>
        </div>
      </div>
      {downloadError && (
        <p className="text-xs text-red-500 flex items-center gap-1 px-1">
          <Icon name="info" size={12} className="shrink-0" />
          {downloadError}
        </p>
      )}
    </div>
  )
}

// ─── Preview popup ──────────────────────────────────────────────────────────

type SrtPreviewPopupProps = {
  preview: PreviewState
  isDownloading: boolean
  onClose: () => void
  onDownload: () => void
}

function SrtPreviewPopup({ preview, isDownloading, onClose, onDownload }: SrtPreviewPopupProps) {
  if (!preview) return null

  const handleBackdropClick = () => onClose()
  const handlePanelClick = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div
        className="h-[calc(100dvh-2rem)] max-h-screen w-full max-w-2xl flex flex-col bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-4 gap-3"
        onClick={handlePanelClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <p className="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
              {preview.file.filename}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">Video ID: {preview.file.video_id}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shrink-0"
          >
            <Icon name="close" size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-3">
          {preview.loading && (
            <div className="flex items-center justify-center h-full text-zinc-400 text-sm gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-spin"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              <span>Đang tải nội dung...</span>
            </div>
          )}
          {preview.error && (
            <div className="flex items-start gap-2 text-red-500 text-sm">
              <Icon name="info" size={15} className="shrink-0 mt-0.5" />
              <span>{preview.error}</span>
            </div>
          )}
          {preview.content && (
            <pre className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed font-mono">
              {preview.content}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end shrink-0 gap-2">
          <button
            onClick={onDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-(--main-cl) hover:bg-(--main-cl-hover) text-black rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-spin"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            ) : (
              <Icon name="download" size={18} strokeWidth={3} />
            )}
            <span>Tải xuống</span>
          </button>
          <button
            className="px-4 py-1 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            <span>Đóng</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export function MyFilesPage() {
  const [query, setQuery] = useState('')
  const [pageState, setPageState] = useState<PageState>('idle')
  const [files, setFiles] = useState<SrtFile[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchedUsername, setSearchedUsername] = useState('')
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())
  const [downloadErrors, setDownloadErrors] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState<PreviewState>(null)

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSearch = async () => {
    const username = query.trim()
    if (!username) return

    setPageState('loading')
    setErrorMessage(null)
    setFiles([])
    setSearchedUsername(username)

    try {
      const files = await fileService.listFilesByUsername(username)
      setFiles(files)
      setPageState('done')
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const detail = AxiosErrorHandler.handleError(err).message
        setErrorMessage(detail)
        setPageState('error')
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleDownloadFile = async (file: SrtFile) => {
    if (downloadingFiles.has(file.filename)) return

    setDownloadingFiles(prev => new Set(prev).add(file.filename))
    setDownloadErrors(prev => {
      const next = { ...prev }
      delete next[file.filename]
      return next
    })

    try {
      await downloadFile(file.filename, file.video_id, searchedUsername)
    } catch (err) {
      if (isAxiosError(err)) {
        const message = AxiosErrorHandler.handleError(err).message
        setDownloadErrors(prev => ({ ...prev, [file.filename]: message }))
      }
    } finally {
      setDownloadingFiles(prev => {
        const next = new Set(prev)
        next.delete(file.filename)
        return next
      })
    }
  }

  const handlePreviewFile = async (file: SrtFile) => {
    setPreview({ file, content: null, loading: true, error: null })

    const baseUrl = import.meta.env.VITE_API_URL ?? ''
    try {
      const response = await fetch(`${baseUrl}/file/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: searchedUsername, video_id: file.video_id, filename: file.filename })
      })

      if (!response.ok) {
        let detail = `Lỗi ${response.status}`
        try {
          const body = await response.json()
          detail = body.detail ?? detail
        } catch {
          // không phải JSON
        }
        setPreview(prev => prev && { ...prev, loading: false, error: detail })
        return
      }

      const content = await response.text()
      setPreview(prev => prev && { ...prev, loading: false, content })
    } catch {
      setPreview(prev => prev && { ...prev, loading: false, error: 'Không thể tải nội dung file.' })
    }
  }

  const handleClosePreview = () => setPreview(null)

  const handleDownloadPreviewFile = () => {
    if (preview) handleDownloadFile(preview.file)
  }

  const isLoading = pageState === 'loading'

  return (
    <main className="px-4 mt-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">Bản dịch của tôi</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Tra cứu và tải xuống các bản phụ đề đã dịch theo username.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhập username để tìm các bản dịch đã thực hiện"
          disabled={isLoading}
          className="w-full pl-4 pr-12 py-3 border border-zinc-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-(--main-cl) focus:border-transparent transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          aria-label="Tìm kiếm"
          className="absolute right-2 p-2 rounded-lg text-zinc-400 hover:text-(--main-cl) hover:bg-(--main-cl)/10 hover:scale-125 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:text-zinc-400 disabled:hover:bg-transparent"
        >
          {isLoading ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-spin"
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          ) : (
            <Icon name="search" size={18} />
          )}
        </button>
      </div>

      {/* Error state */}
      {pageState === 'error' && (
        <div className="mt-6 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl text-sm text-red-600 dark:text-red-400">
          <Icon name="info" size={16} className="shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Results */}
      {pageState === 'done' && (
        <div className="mt-6 flex flex-col gap-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            Tìm thấy <span className="font-semibold text-zinc-700 dark:text-zinc-300">{files.length}</span> bản dịch cho{' '}
            <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">{searchedUsername}</span>
          </p>

          {files.map(file => (
            <SrtFileItem
              key={file.filename}
              file={file}
              isDownloading={downloadingFiles.has(file.filename)}
              downloadError={downloadErrors[file.filename] ?? null}
              onPreview={() => handlePreviewFile(file)}
              onDownload={() => handleDownloadFile(file)}
            />
          ))}
        </div>
      )}

      <SrtPreviewPopup
        preview={preview}
        isDownloading={preview ? downloadingFiles.has(preview.file.filename) : false}
        onClose={handleClosePreview}
        onDownload={handleDownloadPreviewFile}
      />
    </main>
  )
}
