import React, { useRef, useState, useEffect } from 'react'
import { Icon } from '../common/Icon'
import { parseSRT } from '../../utils/parse-SRT'
import { useSubtitleStore } from '../../store/subtitle-store'
import { LoadingDots } from '../common/Loading'

type LoadedFile = {
  name: string
  size: number
  content: string
  subtitleCount: number
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function SubtitleUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const setSubtitles = useSubtitleStore(state => state.setSubtitles)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const [loadedFile, setLoadedFile] = useState<LoadedFile | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const isPickingFileRef = useRef(false)

  useEffect(() => {
    const handleFocus = () => {
      if (isPickingFileRef.current) {
        const hasFile = fileInputRef.current?.files?.length

        if (!hasFile) {
          // user cancel file picker
          setUploading(false)
        }

        isPickingFileRef.current = false
      }
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)
    setUploading(false)

    if (!file) {
      return
    }

    if (!file.name.endsWith('.srt')) {
      setError('Vui lòng chọn file định dạng .srt')
      return
    }

    const reader = new FileReader()
    reader.onload = event => {
      const content = event.target?.result as string
      if (content) {
        try {
          const subtitles = parseSRT(content)
          if (subtitles.length === 0) {
            setError('File subtitle sai format hoặc không có nội dung hợp lệ.')
            return
          }
          setSubtitles(subtitles)
          setLoadedFile({ name: file.name, size: file.size, content, subtitleCount: subtitles.length })
        } catch {
          setError('File subtitle sai format')
        }
      }
    }
    reader.onerror = () => {
      setError('Có lỗi xảy ra khi đọc file')
    }
    reader.readAsText(file)

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUploadClick = () => {
    setUploading(true)
    isPickingFileRef.current = true
    fileInputRef.current?.click()
  }

  const handleOpenPreview = () => setShowPreview(true)
  const handleClosePreview = () => setShowPreview(false)
  const handleBackdropClick = () => setShowPreview(false)
  const handlePanelClick = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <>
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

        {/* Loaded file info section */}
        {loadedFile && (
          <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-xl shadow-sm">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-(--main-cl)/15 shrink-0">
              <Icon name="file-text" size={17} className="text-(--main-cl)" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">{loadedFile.name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-300 mt-0.5">
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
        )}
      </div>

      {/* Preview popup */}
      {showPreview && loadedFile && (
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
                <p className="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">{loadedFile.name}</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {formatFileSize(loadedFile.size)} · {loadedFile.subtitleCount} dòng phụ đề
                </p>
              </div>
              <button
                onClick={handleClosePreview}
                aria-label="Đóng"
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
