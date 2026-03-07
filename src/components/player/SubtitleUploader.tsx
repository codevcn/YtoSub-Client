import React, { useRef, useState, useEffect } from 'react'
import { Icon } from '../common/Icon'
import { parseSRT } from '../../utils/parse-SRT'
import { useSubtitleStore } from '../../store/subtitle-store'
import { LoadingDots } from '../common/Loading'

export function SubtitleUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const setSubtitles = useSubtitleStore(state => state.setSubtitles)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
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
    setSuccess(false)
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
          setSuccess(true)
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

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 transition-colors">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-1">Upload Subtitle</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Chọn file .srt từ máy tính của bạn</p>
        </div>
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-2 px-4 py-2 bg-(--main-cl) hover:bg-(--main-cl-hover) text-black rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
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

      {success && (
        <div className="font-bold mt-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-start gap-2 text-sm border border-green-100 dark:border-green-900/30">
          <Icon name="check" size={18} className="mt-0.5 shrink-0" />
          <span>Subtitle uploaded successfully</span>
        </div>
      )}
    </div>
  )
}
