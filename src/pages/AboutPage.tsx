export function AboutPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="text-5xl mb-6">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 dark:text-zinc-600 mx-auto">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Tính năng đang được phát triển</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
        Trang About Us sẽ sớm ra mắt. Vui lòng quay lại sau.
      </p>
    </main>
  )
}
