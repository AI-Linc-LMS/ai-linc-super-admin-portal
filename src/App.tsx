import { NavLink, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Organizations from './pages/Organizations'
import OrganizationDetail from './pages/OrganizationDetail'
import WhiteLabelMatrix from './pages/WhiteLabelMatrix'

function App() {
  const [isDark, setIsDark] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDark = stored ? stored === 'dark' : prefersDark
    setIsDark(initialDark)
  }, [])

  // Apply class to <html> and persist
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(d => !d)

  // Initialize sidebar collapsed state
  useEffect(() => {
    const stored = localStorage.getItem('sidebar:collapsed')
    setSidebarCollapsed(stored === 'true')
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebar:collapsed', String(sidebarCollapsed))
  }, [sidebarCollapsed])

  const toggleSidebar = () => setSidebarCollapsed(v => !v)

  return (
    <div className={`app-grid bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-200 ${sidebarCollapsed ? '[grid-template-columns:4rem_1fr]' : '[grid-template-columns:16rem_1fr]'}`}>
      <aside className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-200 ${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
        <div className="mb-6 flex items-center justify-center">
          <h1 className={`text-xl font-semibold ${sidebarCollapsed ? 'hidden' : 'block'}`}>Super Admin</h1>
          <div className={`${sidebarCollapsed ? 'flex' : 'hidden'} h-10 w-10 items-center justify-center rounded bg-indigo-600 text-white font-semibold`} title="Super Admin">
            SA
          </div>
        </div>
        <nav className={`flex flex-col gap-2 ${sidebarCollapsed ? 'items-center' : ''}`}>
          <NavLink
            to="/"
            end
            className={({isActive}) => `w-full px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-medium' : ''}`}
            title="Dashboard"
          >
            {sidebarCollapsed ? (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-gray-100 dark:bg-gray-700">D</span>
            ) : (
              'Dashboard'
            )}
          </NavLink>
          <NavLink
            to="/white-labeled"
            className={({isActive}) => `w-full px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-medium' : ''}`}
            title="White-labeled"
          >
            {sidebarCollapsed ? (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-gray-100 dark:bg-gray-700">W</span>
            ) : (
              'White-labeled'
            )}
          </NavLink>
          <NavLink
            to="/users"
            className={({isActive}) => `w-full px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-medium' : ''}`}
            title="Users"
          >
            {sidebarCollapsed ? (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-gray-100 dark:bg-gray-700">U</span>
            ) : (
              'Users'
            )}
          </NavLink>
          <NavLink
            to="/settings"
            className={({isActive}) => `w-full px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-medium' : ''}`}
            title="Settings"
          >
            {sidebarCollapsed ? (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-gray-100 dark:bg-gray-700">S</span>
            ) : (
              'Settings'
            )}
          </NavLink>
        </nav>
      </aside>
      <main className="p-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="inline-flex items-center gap-2 px-3 py-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <span className="text-sm">{sidebarCollapsed ? 'Expand' : 'Collapse'} sidebar</span>
            </button>
            <h2 className="text-2xl font-semibold">Admin Portal</h2>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-3 py-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            <span className="text-sm">{isDark ? 'Light' : 'Dark'} mode</span>
            <span role="img" aria-hidden> {isDark ? '🌞' : '🌙'} </span>
          </button>
        </header>
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/white-labeled" element={<WhiteLabelMatrix />} />
            <Route path="/white-labeled/:id" element={<OrganizationDetail />} />
            {/** Backward-compatible routes (not in menu) */}
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/organizations/:id" element={<OrganizationDetail />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </section>
      </main>
    </div>
  )
}

export default App
