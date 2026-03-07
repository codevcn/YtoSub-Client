import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/common/Icon'

export function NotFoundPage() {
  const navigate = useNavigate()

  const handleGoHome = () => navigate('/')
  const handleGoBack = () => navigate(-1)

  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center select-none">
      {/* Big 404 */}
      <div className="relative mb-6">
        <span className="text-[9rem] font-bold leading-none text-zinc-100 dark:text-zinc-800 select-none pointer-events-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-(--main-cl)"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="11" />
            <line x1="11" y1="14" x2="11.01" y2="14" />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
        Trang không tồn tại
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-8">
        Đường dẫn bạn truy cập không hợp lệ hoặc đã bị xóa. Hãy kiểm tra lại URL.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Icon name="chevron-left" size={16} />
          Quay lại
        </button>
        <button
          onClick={handleGoHome}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--main-cl) hover:bg-(--main-cl-hover) text-sm font-medium text-black transition-colors"
        >
          <Icon name="play" size={14} />
          Về trang chủ
        </button>
      </div>
    </main>
  )
}
