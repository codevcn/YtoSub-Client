import { Icon } from '../common/Icon'
import { LoadingDots } from '../common/Loading'

type UploadSubtitlePopupProps = {
  handleClosePopup: () => void
  loadedFile: {
    name: string
    size: number
    subtitleCount: number
  }
  isPublic: boolean
  handleTogglePublic: () => void
  password: string
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploadStatus: 'idle' | 'loading' | 'done' | 'error'
  uploadError: string | null
  handleUploadSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void
  handleOpenPreview: () => void
  handleApplySubtitle: () => void
  handlePopupBackdropClick: (e: React.MouseEvent<HTMLDivElement>) => void
  handlePopupPanelClick: (e: React.MouseEvent<HTMLDivElement>) => void
  formatFileSize: (size: number) => string
}

export const UploadSubtitlePopup = ({
  handleClosePopup,
  loadedFile,
  isPublic,
  handleTogglePublic,
  password,
  handlePasswordChange,
  uploadStatus,
  uploadError,
  handleUploadSubmit,
  handleOpenPreview,
  handleApplySubtitle,
  handlePopupBackdropClick,
  handlePopupPanelClick,
  formatFileSize
}: UploadSubtitlePopupProps) => {
  return (
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
                Cho phép người dùng xem và dùng phụ đề này
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

          {/* Password field — visible only when is_public is on */}
          {!isPublic && (
            <div className="mt-4 flex flex-col gap-1.5">
              <label htmlFor="subtitle-password" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Mật khẩu bảo vệ <span className="text-zinc-400 dark:text-zinc-500 font-normal">(tuỳ chọn)</span>
              </label>
              <div className="relative">
                <Icon name="lock" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input
                  id="subtitle-password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Nhập mật khẩu để giới hạn truy cập..."
                  className="w-full h-9 pl-8 pr-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-(--main-cl) transition-all"
                />
              </div>
            </div>
          )}

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
  )
}
