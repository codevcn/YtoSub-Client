import { Outlet } from 'react-router-dom'
import { AppHeader } from './components/layout/AppHeader'
import { MobileToaster } from './dev/mobile/Toaster'
import { Toaster } from './components/common/Toaster'

function App() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-(family-name:--font-sans) transition-colors">
      <AppHeader />

      {/* Page content */}
      <Outlet />

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-zinc-500 dark:text-zinc-400 text-sm">
        <p>Tương thích trên desktop, tablet và mobile.</p>
      </footer>

      {/* Toaster */}
      <MobileToaster />
      <Toaster />
    </div>
  )
}

export default App
