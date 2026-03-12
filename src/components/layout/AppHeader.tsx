import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Icon } from '../common/Icon'
import { Drawer } from '../common/Drawer'

type NavItem = {
  label: string
  to: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Dịch Youtube Video', to: '/translate' },
  { label: 'Bản dịch của tôi', to: '/my-files' },
  { label: 'Về chúng tôi', to: '/about' }
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const handleNavItem = (to: string) => {
    navigate(to)
    handleClose()
  }

  return (
    <>
      {/* Desktop nav — hiện thẳng trên header khi >= 900px */}
      <nav className="hidden desktop:flex items-center gap-1">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'text-(--main-cl) bg-(--main-cl)/10 font-bold'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile menu — nút hamburger + Drawer khi < 900px */}
      <div className="desktop:hidden">
        <button
          onClick={handleOpen}
          aria-label="Mở menu"
          className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Icon name="menu" size={22} />
        </button>

        <Drawer isOpen={isOpen} onClose={handleClose} title="Menu">
          <ul>
            {NAV_ITEMS.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end
                  onClick={() => handleNavItem(item.to)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                      isActive
                        ? 'text-(--main-cl) bg-(--main-cl)/10 font-bold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium'
                    }`
                  }
                >
                  <Icon name="chevron-right" size={18} className="opacity-40 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </Drawer>
      </div>
    </>
  )
}

export function AppHeader() {
  return (
    <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 relative top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3 font-app-logo-text text-2xl">
          <h1 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-white">YtoSub</h1>
        </div>
        <Navbar />
      </div>
    </header>
  )
}
