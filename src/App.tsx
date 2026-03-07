import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-(family-name:--font-sans) transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 relative top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 font-app-logo-text text-2xl">
            <h1 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-white">YtoSub</h1>
          </div>
        </div>
      </header>

      {/* Page content */}
      <Outlet />

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-zinc-500 dark:text-zinc-400 text-sm">
        <p>Tương thích trên desktop, tablet và mobile.</p>
      </footer>
    </div>
  )
}

export default App
