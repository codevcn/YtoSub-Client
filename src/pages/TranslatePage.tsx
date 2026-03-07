import { useEffect, useState } from 'react'
import { videoService } from '../services/video.service'
import { Icon } from '../components/common/Icon'
import { LoadingDots } from '../components/common/Loading'
import type { TranslateVideoResponse } from '../types/video'
import { storage } from '../utils/local-storage'

const summaryExample = `- Title: The Super Mario Bros. Movie | Official Trailer
- Genre: Phiêu lưu
- Main Characters: Mario, Bowser, và các nhân vật khác (được miêu tả là có ria mép, mặc trang phục giống nhau và đội mũ in chữ cái đầu của tên).
- Theme: Cuộc hành trình phiêu lưu để ngăn chặn "quái vật" Bowser và giải cứu các thiên hà trong vũ trụ bao la.
- Summary (theo video timeline): 
Đoạn trailer mở đầu với câu cảm thán hào hứng "let's a go", theo sau đó là lời tuyên bố của một nhân vật về việc sắp thống trị thế giới. Tuy nhiên, kẻ này thừa nhận đang gặp phải một rắc rối liên quan đến một con người có ria mép. 

Ngay sau đó, một nhân vật khác lên tiếng phàn nàn một cách hài hước rằng họ không thể quen biết tất cả những người có ria mép, mặc trang phục giống hệt nhau và đội chiếc mũ có in chữ cái đầu tiên của tên mình. Nhân vật này cảnh báo rằng Bowser đang đến và tất cả phải cùng nhau hợp sức để ngăn chặn con quái vật đó, bất chấp việc họ tự nhận mình có vẻ ngoài vô cùng "đáng yêu".

Khi sự việc tiếp diễn, Mario được cổ vũ tiến lên vì "cuộc phiêu lưu lớn" của họ chính thức bắt đầu, đi kèm với một số tình huống hoảng loạn hài hước khi có người la hét "lấy nó ra khỏi tôi". Cuối cùng, đoạn video khép lại với lời nhắc nhở Mario rằng có cả một vũ trụ rộng lớn với rất nhiều thiên hà đang trông cậy vào họ, kèm theo lời an ủi "không áp lực đâu" và tiếng reo hò "woohoo" đầy phấn khích.`

function isValidYoutubeUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/.test(url)
}

export function TranslatePage() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoSummary, setVideoSummary] = useState('')
  const [result, setResult] = useState<TranslateVideoResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)
  const [showExamplePopup, setShowExamplePopup] = useState(false)

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    storage.set('ytosub:last-summary-url', url)
    setVideoUrl(url)
    setUrlError(null)
  }

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVideoSummary(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidYoutubeUrl(videoUrl)) {
      setUrlError('URL không hợp lệ. Vui lòng nhập đường dẫn YouTube (youtube.com hoặc youtu.be).')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setUrlError(null)

    try {
      const data = await videoService.translateVideo({
        video_url: videoUrl,
        video_summary: videoSummary.trim() || undefined
      })
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenExample = () => setShowExamplePopup(true)
  const handleCloseExample = () => setShowExamplePopup(false)

  const initLastSummaryUrl = () => {
    const lastUrl = storage.get('ytosub:last-summary-url')
    if (typeof lastUrl === 'string') {
      setVideoUrl(lastUrl)
    }
  }

  useEffect(() => {
    initLastSummaryUrl()
  }, [])

  return (
    <main className="max-w-2xl mx-auto px-4 mt-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">Dịch Phụ Đề</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Nhập URL video YouTube để dịch phụ đề sang tiếng Việt.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 flex flex-col gap-4"
      >
        {/* YouTube URL */}
        <div>
          <label htmlFor="video-url" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            YouTube URL <span className="text-red-500">*</span>
          </label>
          <input
            id="video-url"
            type="text"
            value={videoUrl}
            onChange={handleUrlChange}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled={loading}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-(--main-cl) focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {urlError && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <Icon name="info" size={13} className="shrink-0" />
              {urlError}
            </p>
          )}
        </div>

        {/* Summary */}
        <div>
          <label htmlFor="video-summary" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Tóm tắt nội dung <span className="text-zinc-400 dark:text-zinc-500 font-normal">(tuỳ chọn)</span>
          </label>
          <textarea
            id="video-summary"
            value={videoSummary}
            onChange={handleSummaryChange}
            placeholder="Mô tả ngắn gọn nội dung video để cải thiện chất lượng dịch..."
            rows={6}
            disabled={loading}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-(--main-cl) focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {/* Summary hint */}
          <div className="border-l-4 border-yellow-500 mt-2 p-3 bg-zinc-50 dark:bg-zinc-900/60 outline outline-yellow-500 dark:outline-yellow-500 rounded-lg text-xs text-zinc-500 dark:text-zinc-400">
            <p className="font-medium text-zinc-600 dark:text-zinc-300 mb-1">
              Thêm bản tóm tắt sẽ giúp bản phụ đề được dịch chính xác hơn. Bản tóm tắt nên được viết theo cấu trúc sau:
            </p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Title:</li>
              <li>Genre:</li>
              <li>Main Characters:</li>
              <li>Theme:</li>
              <li>Summary (theo video timeline)</li>
            </ul>
            <button
              type="button"
              onClick={handleOpenExample}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-(--main-cl) hover:underline"
            >
              <Icon name="info" size={13} className="shrink-0" />
              Xem ví dụ bản tóm tắt
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !videoUrl.trim()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-(--main-cl) hover:bg-(--main-cl-hover) text-black rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <LoadingDots />
          ) : (
            <>
              <Icon name="play" size={16} />
              <span>Dịch phụ đề</span>
            </>
          )}
        </button>

        {loading && (
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Đang xử lý, vui lòng không tắt trang. Quá trình có thể mất vài phút...
          </p>
        )}
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-start gap-2 text-sm border border-red-100 dark:border-red-900/30">
          <Icon name="info" size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Example popup */}
      {showExamplePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={handleCloseExample}
        >
          <div
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 w-full max-w-lg p-6 flex flex-col gap-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">Ví dụ bản tóm tắt</h2>
              <button
                type="button"
                onClick={handleCloseExample}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                title="Đóng"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <pre className="text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700 whitespace-pre-wrap leading-relaxed font-mono">
              {summaryExample}
            </pre>
            <button
              type="button"
              onClick={handleCloseExample}
              className="self-end px-4 py-1.5 bg-(--main-cl) hover:bg-(--main-cl-hover) text-black rounded-lg text-sm font-medium transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Success */}
      {result && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/30 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm">
            <Icon name="check" size={16} className="shrink-0" />
            <span>{result.message}</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 pl-6">
            Video ID: <span className="font-mono text-zinc-700 dark:text-zinc-300">{result.video_id}</span>
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 pl-6 break-all">
            File: <span className="font-mono text-zinc-700 dark:text-zinc-300">{result.output_file}</span>
          </p>
        </div>
      )}
    </main>
  )
}
