import React, { useRef, useState, useEffect } from 'react'
import { isAxiosError } from 'axios'
import { Icon } from '../common/Icon'
import { parseSRT } from '../../utils/parse-SRT'
import { useSubtitleStore } from '../../store/subtitle-store'
import { LoadingDots } from '../common/Loading'
import { storage } from '../../utils/local-storage'
import { fileService } from '../../services/file.service'
import { DEFAULT_USERNAME } from '../../utils/constants'
import type { Subtitle } from '../../types/global'
import { AxiosErrorHandler } from '../../utils/axios-error-handler'

type LoadedFile = {
  name: string
  size: number
  content: string
  subtitleCount: number
  parsedSubtitles: Subtitle[]
}

type UploadStatus = 'idle' | 'loading' | 'done' | 'error'

type SubtitleUploaderProps = {
  videoUrl: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function SubtitleUploader({ videoUrl }: SubtitleUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<File | null>(null)
  const isPickingFileRef = useRef(false)
  const setSubtitles = useSubtitleStore(state => state.setSubtitles)

  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loadedFile, setLoadedFile] = useState<LoadedFile | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    const handleFocus = () => {
      if (isPickingFileRef.current) {
        if (!fileInputRef.current?.files?.length) {
          setUploading(false)
        }
        isPickingFileRef.current = false
      }
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)
    setUploading(false)

    if (!file) return

    if (!file.name.endsWith('.srt')) {
      setError('Vui lòng chọn file định dạng .srt')
      return
    }

    fileRef.current = file
    const reader = new FileReader()
    reader.onload = event => {
      const content = event.target?.result as string
      if (!content) return
      try {
        const parsedSubtitles = parseSRT(content)
        if (parsedSubtitles.length === 0) {
          setError('File subtitle sai format hoặc không có nội dung hợp lệ.')
          return
        }
        setLoadedFile({
          name: file.name,
          size: file.size,
          content,
          subtitleCount: parsedSubtitles.length,
          parsedSubtitles
        })
        setUploadStatus('idle')
        setUploadError(null)
        setShowPopup(true)
      } catch {
        setError('File subtitle sai format')
      }
    }
    reader.onerror = () => setError('Có lỗi xảy ra khi đọc file')
    reader.readAsText(file)

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUploadClick = () => {
    setUploading(true)
    isPickingFileRef.current = true
    fileInputRef.current?.click()
  }

  const handleClosePopup = () => setShowPopup(false)
  const handlePopupBackdropClick = () => setShowPopup(false)
  const handlePopupPanelClick = (e: React.MouseEvent) => e.stopPropagation()

  const handleOpenPreview = () => setShowPreview(true)
  const handleClosePreview = () => setShowPreview(false)
  const handlePreviewBackdropClick = () => setShowPreview(false)
  const handlePreviewPanelClick = (e: React.MouseEvent) => e.stopPropagation()

  const handleTogglePublic = () => setIsPublic(prev => !prev)

  const handleApplySubtitle = () => {
    if (loadedFile) {
      setSubtitles(loadedFile.parsedSubtitles)
    }
    setShowPopup(false)
  }

  const handleUploadSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!fileRef.current || !loadedFile) return

    if (!videoUrl) {
      setUploadError('Vui lòng nhập URL YouTube trên trang chủ trước khi upload lên server.')
      setUploadStatus('error')
      return
    }

    const saved = storage.get('ytosub:username')
    const username = typeof saved === 'string' && saved.trim() ? saved.trim() : DEFAULT_USERNAME

    setUploadStatus('loading')
    setUploadError(null)

    try {
      await fileService.uploadSubtitle({ username, video_link: videoUrl, is_public: isPublic, file: fileRef.current })
      setUploadStatus('done')
    } catch (err) {
      console.error('>>> Upload error:', err)
      if (isAxiosError(err)) {
        const detail = AxiosErrorHandler.handleError(err).message
        setUploadError(typeof detail === 'string' ? detail : 'Lỗi khi upload file lên server.')
      } else {
        setUploadError('Lỗi khi upload file lên server.')
      }
      setUploadStatus('error')
    }
  }

  return (
    <>
      {/* Upload button card */}
      <div className="w-full max-w-2xl mx-auto mt-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Upload Subtitle</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Chọn file .srt từ máy tính của bạn</p>
          </div>
          <button
            onClick={handleUploadClick}
            className="flex items-center h-10 gap-2 px-4 bg-(--main-cl) hover:bg-(--main-cl-hover) text-black rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            {uploading ? (
              <LoadingDots />
            ) : (
              <>
                <Icon name="upload" size={18} />
                <span>Upload .srt</span>
              </>
            )}
          </button>
          <input
            type="file"
            accept=".srt"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            title="Upload SRT subtitle"
          />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm border border-red-100 dark:border-red-900/30">
            <Icon name="info" size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loaded file badge — click to reopen popup */}
        {loadedFile && !showPopup && (
          <button
            onClick={() => setShowPopup(true)}
            className="mt-4 w-full flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-xl hover:border-(--main-cl)/50 transition-colors text-left"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-(--main-cl)/15 shrink-0">
              <Icon name="file-text" size={17} className="text-(--main-cl)" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">{loadedFile.name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {formatFileSize(loadedFile.size)} · {loadedFile.subtitleCount} dòng phụ đề
              </p>
            </div>
            <Icon name="chevron-right" size={18} className="text-zinc-400 shrink-0" />
          </button>
        )}
      </div>

      {/* ── Main popup ─────────────────────────────────────────────────────── */}
      {showPopup && loadedFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={handlePopupBackdropClick}
        >
          <div
            className="w-full max-w-lg flex flex-col bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
            onClick={handlePopupPanelClick}
          >
            {/* Popup header */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-200 dark:border-zinc-700">
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Chi tiết phụ đề</p>
              <button
                onClick={handleClosePopup}
                aria-label="Đóng popup"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            {/* Section: file info */}
            <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-700">
              <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
                Thông tin file
              </p>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-(--main-cl)/15 shrink-0">
                  <Icon name="file-text" size={17} className="text-(--main-cl)" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">{loadedFile.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {formatFileSize(loadedFile.size)} · {loadedFile.subtitleCount} dòng phụ đề
                  </p>
                </div>
                <button
                  onClick={handleOpenPreview}
                  aria-label="Xem trước nội dung file"
                  title="Xem trước"
                  className="p-2 rounded-lg text-zinc-400 dark:text-zinc-300 hover:text-(--main-cl) hover:bg-(--main-cl)/10 active:bg-(--main-cl)/20 transition-colors shrink-0"
                >
                  <Icon name="eye" size={20} />
                </button>
              </div>
            </div>

            {/* Section: upload form */}
            <form onSubmit={handleUploadSubmit} className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-700">
              <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
                Gửi lên server
              </p>

              {/* is_public switch row */}
              <div className="flex items-center justify-between gap-4 py-1">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Công khai</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 leading-relaxed">
                    Cho phép người dùng khác tìm kiếm và dùng phụ đề này
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPublic}
                  onClick={handleTogglePublic}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--main-cl) ${
                    isPublic ? 'bg-(--main-cl)' : 'bg-zinc-300 dark:bg-zinc-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                      isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Upload feedback */}
              {uploadStatus === 'done' && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2 text-sm border border-green-100 dark:border-green-900/30">
                  <Icon name="check" size={15} className="shrink-0" />
                  <span>Upload lên server thành công!</span>
                </div>
              )}
              {uploadStatus === 'error' && uploadError && (
                <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm border border-red-100 dark:border-red-900/30">
                  <Icon name="info" size={15} className="mt-0.5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={uploadStatus === 'loading' || uploadStatus === 'done'}
                className="mt-4 w-full flex items-center justify-center gap-2 h-10 bg-(--main-cl) hover:bg-(--main-cl-hover) text-black rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadStatus === 'loading' ? (
                  <LoadingDots />
                ) : uploadStatus === 'done' ? (
                  <>
                    <Icon name="check" size={16} />
                    <span>Đã upload</span>
                  </>
                ) : (
                  <>
                    <Icon name="upload" size={16} />
                    <span>Upload lên server</span>
                  </>
                )}
              </button>
            </form>

            {/* Bottom: apply subtitle to player */}
            <div className="px-5 py-4">
              <button
                onClick={handleApplySubtitle}
                className="w-full flex items-center justify-center gap-2 h-11 border-2 border-(--main-cl) text-(--main-cl) hover:bg-(--main-cl)/10 rounded-lg text-sm font-semibold transition-colors"
              >
                <Icon name="check" size={17} />
                <span>Áp dụng phụ đề</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview overlay (z above main popup) ───────────────────────────── */}
      {showPreview && loadedFile && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={handlePreviewBackdropClick}
        >
          <div
            className="h-[calc(100dvh-2rem)] max-h-screen w-full max-w-2xl flex flex-col bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-4 gap-3"
            onClick={handlePreviewPanelClick}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                  {loadedFile.name}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {formatFileSize(loadedFile.size)} · {loadedFile.subtitleCount} dòng phụ đề
                </p>
              </div>
              <button
                onClick={handleClosePreview}
                aria-label="Đóng xem trước"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shrink-0"
              >
                <Icon name="close" size={22} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-3">
              <pre className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed font-mono">
                {loadedFile.content}
              </pre>
            </div>

            {/* Footer */}
            <div className="flex justify-end shrink-0">
              <button
                onClick={handleClosePreview}
                className="px-4 py-2 bg-(--main-cl) hover:bg-(--main-cl-hover) text-black rounded-lg text-sm font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
