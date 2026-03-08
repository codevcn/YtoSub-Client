import { useState } from 'react'
import { Icon } from '../../components/common/Icon'
import { downloadFile } from '../../utils/download-file'
import type { StreamStatus, TranslateEventSnapshot } from '../../hooks/use-translate-stream'
import type { DoneEventData } from '../../types/video'

type TranslateProgressPanelProps = {
  status: StreamStatus
  eventSnapshot: TranslateEventSnapshot | null
  result: DoneEventData | null
  error: string | null
  username: string
}

const FILE_BTN_CLASS =
  'w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-(--main-cl)/10 hover:border-(--main-cl)/40 active:bg-(--main-cl)/20 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed group'

// ─── Progress bar section (pending / translating states) ───────────────────

type ProgressBarSectionProps = {
  status: StreamStatus
  eventSnapshot: TranslateEventSnapshot | null
}

function ProgressBarSection({ status, eventSnapshot }: ProgressBarSectionProps) {
  const isLoading = status === 'pending' || status === 'translating'
  const percent = eventSnapshot?.percent ?? 0

  return (
    <>
      {/* pending, no snapshot yet */}
      {status === 'pending' && !eventSnapshot && (
        <div className="flex flex-col gap-3">
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full w-full rounded-full"
              style={{
                backgroundImage: 'repeating-linear-gradient(135deg, var(--main-cl) 0px, var(--main-cl) 20px, rgba(0,0,0,0.15) 20px, rgba(0,0,0,0.15) 40px)',
                backgroundSize: '40px 100%',
                animation: 'stripe-slide 0.6s linear infinite'
              }}
            />
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">Đang gửi yêu cầu tới server...</p>
        </div>
      )}

      {/* translating, no snapshot yet */}
      {status === 'translating' && !eventSnapshot && (
        <div className="flex flex-col gap-3">
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
            <div className="bg-(--main-cl) h-2 rounded-full w-1/6 animate-pulse" />
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">Đang khởi tạo pipeline dịch...</p>
        </div>
      )}

      {/* in-progress with snapshot */}
      {isLoading && eventSnapshot && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>{eventSnapshot.message}</span>
            <span className="font-mono font-medium text-zinc-700 dark:text-zinc-200 shrink-0 ml-2">{percent}%</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-(--main-cl) h-2 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}
    </>
  )
}

// ─── Done file list section ────────────────────────────────────────────────

type DoneFilesSectionProps = {
  result: DoneEventData
  eventSnapshot: TranslateEventSnapshot
  downloadingFiles: Set<string>
  downloadErrors: Record<string, string>
  onDownloadTranslateFile: () => void
  onDownloadTranscriptFile: () => void
  onDownloadSummaryFile: () => void
}

function DoneFilesSection({
  result,
  eventSnapshot,
  downloadingFiles,
  downloadErrors,
  onDownloadTranslateFile,
  onDownloadTranscriptFile,
  onDownloadSummaryFile,
}: DoneFilesSectionProps) {
  const percent = eventSnapshot.percent

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span className="w-max max-w-full truncate">{eventSnapshot.message}</span>
        <span className="font-mono font-medium text-green-600 dark:text-green-400 shrink-0 ml-2">{percent}%</span>
      </div>
      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
        <div className="bg-green-500 h-2 rounded-full w-full transition-all duration-500" />
      </div>

      <div className="mt-1 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/30 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm">
          <Icon name="check" size={16} className="shrink-0" />
          <span>Hoàn thành! Nhấn vào file để tải xuống.</span>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Video ID: <span className="font-mono text-zinc-700 dark:text-zinc-300">{result.video_id}</span>
        </p>

        {/* Translate file */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Phụ đề đã dịch</span>
          <button
            onClick={onDownloadTranslateFile}
            disabled={downloadingFiles.has(result.translate_file)}
            className={FILE_BTN_CLASS}
            title={result.translate_file}
          >
            <Icon
              name={downloadingFiles.has(result.translate_file) ? 'close' : 'download'}
              size={14}
              className="shrink-0 text-zinc-400 group-hover:text-(--main-cl) transition-colors"
            />
            <span className="flex-1 font-mono text-xs text-zinc-700 dark:text-zinc-300 truncate">
              {result.translate_file}
            </span>
            {downloadingFiles.has(result.translate_file) && (
              <span className="text-xs text-zinc-400 shrink-0">Đang tải...</span>
            )}
          </button>
          {downloadErrors[result.translate_file] && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <Icon name="info" size={12} className="shrink-0" />
              {downloadErrors[result.translate_file]}
            </p>
          )}
        </div>

        {/* Transcript file */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Transcript gốc</span>
          <button
            onClick={onDownloadTranscriptFile}
            disabled={downloadingFiles.has(result.transcript_file)}
            className={FILE_BTN_CLASS}
            title={result.transcript_file}
          >
            <Icon
              name={downloadingFiles.has(result.transcript_file) ? 'close' : 'download'}
              size={14}
              className="shrink-0 text-zinc-400 group-hover:text-(--main-cl) transition-colors"
            />
            <span className="flex-1 font-mono text-xs text-zinc-700 dark:text-zinc-300 truncate">
              {result.transcript_file}
            </span>
            {downloadingFiles.has(result.transcript_file) && (
              <span className="text-xs text-zinc-400 shrink-0">Đang tải...</span>
            )}
          </button>
          {downloadErrors[result.transcript_file] && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <Icon name="info" size={12} className="shrink-0" />
              {downloadErrors[result.transcript_file]}
            </p>
          )}
        </div>

        {/* Summary file */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Tóm tắt</span>
          {result.summary_file ? (
            <>
              <button
                onClick={onDownloadSummaryFile}
                disabled={downloadingFiles.has(result.summary_file)}
                className={FILE_BTN_CLASS}
                title={result.summary_file}
              >
                <Icon
                  name={downloadingFiles.has(result.summary_file) ? 'close' : 'download'}
                  size={14}
                  className="shrink-0 text-zinc-400 group-hover:text-(--main-cl) transition-colors"
                />
                <span className="flex-1 font-mono text-xs text-zinc-700 dark:text-zinc-300 truncate">
                  {result.summary_file}
                </span>
                {downloadingFiles.has(result.summary_file) && (
                  <span className="text-xs text-zinc-400 shrink-0">Đang tải...</span>
                )}
              </button>
              {downloadErrors[result.summary_file] && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <Icon name="info" size={12} className="shrink-0" />
                  {downloadErrors[result.summary_file]}
                </p>
              )}
            </>
          ) : (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 italic px-1">Không có</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main panel ────────────────────────────────────────────────────────────

export function TranslateProgressPanel({ status, eventSnapshot, result, error, username }: TranslateProgressPanelProps) {
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())
  const [downloadErrors, setDownloadErrors] = useState<Record<string, string>>({})

  const handleDownloadFile = async (filename: string) => {
    if (!result || downloadingFiles.has(filename)) return
    setDownloadingFiles(prev => new Set(prev).add(filename))
    setDownloadErrors(prev => {
      const next = { ...prev }
      delete next[filename]
      return next
    })
    try {
      await downloadFile(filename, result.video_id, username)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Tải xuống thất bại.'
      setDownloadErrors(prev => ({ ...prev, [filename]: message }))
    } finally {
      setDownloadingFiles(prev => {
        const next = new Set(prev)
        next.delete(filename)
        return next
      })
    }
  }

  const handleDownloadTranslateFile = () => {
    if (result) handleDownloadFile(result.translate_file)
  }

  const handleDownloadTranscriptFile = () => {
    if (result) handleDownloadFile(result.transcript_file)
  }

  const handleDownloadSummaryFile = () => {
    if (result?.summary_file) handleDownloadFile(result.summary_file)
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 py-4 px-2 flex flex-col gap-4">
      <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">Tiến độ dịch</h2>

      <ProgressBarSection status={status} eventSnapshot={eventSnapshot} />

      {status === 'done' && eventSnapshot && result && (
        <DoneFilesSection
          result={result}
          eventSnapshot={eventSnapshot}
          downloadingFiles={downloadingFiles}
          downloadErrors={downloadErrors}
          onDownloadTranslateFile={handleDownloadTranslateFile}
          onDownloadTranscriptFile={handleDownloadTranscriptFile}
          onDownloadSummaryFile={handleDownloadSummaryFile}
        />
      )}

      {status === 'error' && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm border border-red-100 dark:border-red-900/30">
          <Icon name="info" size={16} className="mt-0.5 shrink-0" />
          <span>{error ?? 'Đã xảy ra lỗi không xác định.'}</span>
        </div>
      )}
    </div>
  )
}
