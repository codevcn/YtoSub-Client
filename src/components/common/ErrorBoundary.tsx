import { useState } from 'react'
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'

// ─── Broken Robot SVG icon ────────────────────────────────────────────────────
// Giữ nguyên component Icon từ file cũ của bạn
function BrokenBotIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="6" y="10" width="36" height="28" rx="5" />
      <line x1="24" y1="10" x2="24" y2="5" />
      <circle cx="24" cy="3.5" r="2" fill="currentColor" stroke="none" />
      <rect x="2" y="18" width="4" height="10" rx="2" />
      <rect x="42" y="18" width="4" height="10" rx="2" />
      <circle cx="17" cy="23" r="4" />
      <circle cx="17" cy="23" r="1.5" fill="currentColor" stroke="none" />
      <line x1="28" y1="19" x2="35" y2="26" />
      <line x1="35" y1="19" x2="28" y2="26" />
      <path d="M13 33 Q16 30 19 33 Q22 36 25 33 Q28 30 31 33 Q34 36 37 33" />
      <path d="M30 10 L27 17 L32 21 L29 28" />
      <line x1="10" y1="4" x2="10" y2="8" />
      <line x1="8" y1="6" x2="12" y2="6" />
      <line x1="8.6" y1="4.6" x2="11.4" y2="7.4" />
      <line x1="11.4" y1="4.6" x2="8.6" y2="7.4" />
      <line x1="38" y1="3" x2="38" y2="7" />
      <line x1="36" y1="5" x2="40" y2="5" />
      <line x1="36.6" y1="3.6" x2="39.4" y2="6.4" />
      <line x1="39.4" y1="3.6" x2="36.6" y2="6.4" />
    </svg>
  )
}

// ─── Main ErrorBoundary Component ───────────────────────────────────────────────

export function ErrorBoundary() {
  const error = useRouteError() // Hook lấy thông tin lỗi từ React Router
  const navigate = useNavigate()
  const [showDetail, setShowDetail] = useState(false)

  // Xử lý thông tin lỗi dựa trên kiểu dữ liệu trả về từ React Router
  let errorMessage = 'Một lỗi không mong đợi đã xảy ra.'
  let errorStatus = 'err_unexpected'
  let stackTrace = ''

  if (isRouteErrorResponse(error)) {
    // Lỗi từ Response (ví dụ: 404, 500)
    errorMessage = error.statusText || error.data?.message || errorMessage
    errorStatus = `err_status_${error.status}`
  } else if (error instanceof Error) {
    // Lỗi logic JavaScript thông thường
    errorMessage = error.message
    stackTrace = error.stack || ''
  }

  function handleRetry() {
    // Tải lại trang hiện tại
    window.location.reload()
  }

  function handleGoHome() {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 font-(family-name:--font-sans) relative overflow-hidden">
      {/* Nền trang trí và hiệu ứng giữ nguyên từ file cũ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage:
            'linear-gradient(var(--main-cl) 1px, transparent 1px), linear-gradient(90deg, var(--main-cl) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 max-w-md w-full text-center">
        {/* Robot bay lơ lửng */}
        <div className="text-(--main-cl)" style={{ animation: 'float-bob 3s ease-in-out infinite' }}>
          <BrokenBotIcon />
        </div>

        {/* Mã lỗi badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-(--main-cl)/30 bg-(--main-cl)/10">
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
            <circle cx="4" cy="4" r="4" fill="currentColor" className="text-(--main-cl) animate-pulse" />
          </svg>
          <span className="text-xs font-mono font-bold text-(--main-cl) tracking-[0.18em] uppercase">
            {errorStatus}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h1
            className="text-2xl font-bold text-zinc-50 leading-tight"
            style={{ animation: 'glitch-shake 5s ease-in-out infinite' }}
          >
            Úi, có lỗi xảy ra!
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Trang web vừa gặp sự cố ngoài ý muốn.
            <br />
            Đừng lo, chúng tôi đã báo cáo cho quản trị viên. Hãy thử tải lại trang sau giây lát.
          </p>
        </div>

        {/* Hiển thị chi tiết lỗi */}
        <div className="w-full">
          <button
            type="button"
            onClick={() => setShowDetail(!showDetail)}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-(--main-cl) transition-colors mx-auto"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: showDetail ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {showDetail ? 'Ẩn chi tiết lỗi' : 'Xem chi tiết lỗi'}
          </button>

          {showDetail && (
            <pre className="mt-2 w-full text-left text-[12px] font-mono text-red-400 bg-zinc-900 border border-zinc-800 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed max-h-48 overflow-y-auto">
              {errorMessage}
              {stackTrace && `\n\n${stackTrace}`}
            </pre>
          )}
        </div>

        {/* Các nút hành động */}
        <div className="flex gap-3 w-full">
          <button
            type="button"
            onClick={handleRetry}
            className="flex-1 flex items-center justify-center gap-2 h-10 bg-(--main-cl) hover:bg-(--main-cl-hover) text-zinc-950 text-sm font-semibold rounded-lg transition-colors"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Thử lại
          </button>

          <button
            type="button"
            onClick={handleGoHome}
            className="flex-1 flex items-center justify-center gap-2 h-10 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 text-sm font-medium rounded-lg transition-colors"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  )
}
