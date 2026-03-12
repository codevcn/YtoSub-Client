import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { Icon } from '../../components/common/Icon'
import { LoadingDots } from '../../components/common/Loading'
import { Tooltip } from '../../components/common/Tooltip'
import { AutoSizeTextField } from '../../components/common/AutoSizeTextField'
import { storage } from '../../utils/local-storage'
import { useTranslateStream } from '../../hooks/use-translate-stream'
import { TranslateProgressPanel } from './TranslateProgress'

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
  const [urlError, setUrlError] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [showExamplePopup, setShowExamplePopup] = useState(false)

  const { status, eventSnapshot, result, error, start, cancel } = useTranslateStream()
  const loading: boolean = status === 'pending' || status === 'translating'
  const hasActivity = status !== 'idle'

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    storage.set('ytosub:last-summary-url', url)
    setVideoUrl(url)
    setUrlError(null)
  }

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVideoSummary(e.target.value)
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)
    setUsernameError(null)
    storage.set('ytosub:username', value)
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isValidYoutubeUrl(videoUrl)) {
      setUrlError('URL không hợp lệ. Vui lòng nhập đường dẫn YouTube (youtube.com hoặc youtu.be).')
      return
    }

    if (username.trim() && !/^[a-zA-Z0-9_-]{2,18}$/.test(username.trim())) {
      setUsernameError('Username chỉ gồm chữ cái, số, dấu gạch dưới/ngang và có độ dài 2–18 ký tự.')
      return
    }

    setUrlError(null)

    start({
      video_url: videoUrl,
      username: username.trim() || 'anonymous_user',
      video_summary: videoSummary.trim() || undefined
    })
  }

  const handleOpenExample = () => setShowExamplePopup(true)
  const handleCloseExample = () => setShowExamplePopup(false)

  const initLastSummaryUrl = () => {
    const lastUrl = storage.get('ytosub:last-summary-url')
    if (typeof lastUrl === 'string') {
      setVideoUrl(lastUrl)
    }
  }

  const initUsername = () => {
    const saved = storage.get('ytosub:username')
    if (typeof saved === 'string') {
      setUsername(saved)
    }
  }

  useEffect(() => {
    initLastSummaryUrl()
    initUsername()
  }, [])

  return (
    <main className="px-4 mt-6 max-w-7xl mx-auto">
      {/* 2-panel on desktop (≥900px), stacked on mobile */}
      <div className="flex flex-col justify-center desktop:flex-row desktop:items-start gap-6">
        {/* ── LEFT / TOP: Form section ── */}
        <div className="w-full desktop:max-w-2xl desktop:shrink-0">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">Dịch Phụ Đề</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Nhập URL video YouTube để dịch phụ đề sang tiếng Việt.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 py-4 px-2 flex flex-col gap-4"
          >
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                <span>Tên đăng nhập</span>
                <span className="text-zinc-400 dark:text-zinc-400 font-normal">(tuỳ chọn)</span>
                <Tooltip
                  content="Tên định danh của bạn. Chỉ gồm chữ cái, số, dấu gạch dưới (3-16 ký tự)."
                  placement="bottom"
                >
                  <Icon name="info" size={15} className="text-zinc-400 cursor-help shrink-0" />
                </Tooltip>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="vd: my_username"
                disabled={loading}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-(--main-cl) focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {usernameError && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <Icon name="info" size={13} className="shrink-0" />
                  {usernameError}
                </p>
              )}
            </div>

            {/* YouTube URL */}
            <div>
              <label
                htmlFor="video-url"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                <span>YouTube URL</span>
                <span className="text-red-500">*</span>
                <Tooltip
                  content="Dán URL video YouTube cần dịch. Hỗ trợ youtube.com/watch?v=... và youtu.be/..."
                  placement="bottom"
                >
                  <Icon name="info" size={15} className="text-zinc-400 cursor-help shrink-0" />
                </Tooltip>
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

            {/* Video preview */}
            {isValidYoutubeUrl(videoUrl) && (
              <div className="w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 aspect-video bg-black">
                <ReactPlayer src={videoUrl} width="100%" height="100%" controls={true} light={true} />
              </div>
            )}

            {/* Summary */}
            <div>
              <label
                htmlFor="video-summary"
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                <span>Tóm tắt nội dung</span>
                <span className="text-zinc-400 dark:text-zinc-400 font-normal">(tuỳ chọn)</span>
                <Tooltip
                  content="Cung cấp ngữ cảnh giúp AI dịch chính xác hơn tên nhân vật, thuật ngữ và chủ đề video."
                  placement="bottom"
                >
                  <Icon name="info" size={15} className="text-zinc-400 cursor-help shrink-0" />
                </Tooltip>
              </label>
              <AutoSizeTextField
                id="video-summary"
                value={videoSummary}
                onChange={handleSummaryChange}
                placeholder="Tóm tắt video để cải thiện chất lượng dịch..."
                rows={3}
                disabled={loading}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-(--main-cl) focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {/* Summary hint */}
              <div className="border-l-4 border-yellow-500 mt-2 p-3 bg-zinc-50 dark:bg-zinc-900/60 outline-2 outline-yellow-500 dark:outline-yellow-500 rounded-lg text-sm text-zinc-500 dark:text-zinc-400">
                <p className="font-medium text-base dark:text-zinc-300 mb-1">
                  Thêm bản tóm tắt sẽ giúp bản phụ đề được dịch chính xác hơn. Bản tóm tắt nên được viết theo cấu trúc
                  sau:
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-zinc-300">
                  <li>Tiêu đề:</li>
                  <li>Thể loại:</li>
                  <li>Nhân vật chính:</li>
                  <li>Chủ đề:</li>
                  <li>Tóm tắt (viết thành từng đoạn văn bản theo timeline của video)</li>
                </ul>
                <button
                  type="button"
                  onClick={handleOpenExample}
                  className="mt-2 flex items-center gap-1 font-bold text-(--main-cl) hover:underline"
                >
                  <Icon name="info" size={16} className="shrink-0" />
                  Xem ví dụ bản tóm tắt
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !videoUrl.trim()}
              className="flex items-center justify-center gap-2 px-4 h-10 bg-(--main-cl) hover:bg-(--main-cl-hover) text-black rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
              <button
                type="button"
                onClick={cancel}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 rounded-lg font-medium transition-colors"
              >
                <Icon name="close" size={16} />
                <span>Huỷ</span>
              </button>
            )}
          </form>
        </div>

        {/* ── RIGHT / BOTTOM: Progress section — always rendered when has activity ── */}
        {hasActivity && (
          <div className="w-full desktop:flex-1 desktop:sticky desktop:top-6">
            <TranslateProgressPanel
              status={status}
              eventSnapshot={eventSnapshot}
              result={result}
              error={error}
              username={username.trim() || 'anonymous_user'}
            />
          </div>
        )}
      </div>

      {/* Example popup */}
      {showExamplePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2"
          onClick={handleCloseExample}
        >
          <div
            className="h-[calc(100dvh-2rem)] max-h-screen flex flex-col bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 w-full max-w-lg p-6 gap-4"
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
            <p className="overflow-y-auto grow text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 rounded-lg py-3 px-2 border border-zinc-200 dark:border-zinc-700 whitespace-pre-wrap leading-relaxed font-mono">
              {summaryExample}
            </p>
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
    </main>
  )
}
