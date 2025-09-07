import { NavLink, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Organizations from './pages/Organizations'
import OrganizationDetail from './pages/OrganizationDetail'
import WhiteLabelMatrix from './pages/WhiteLabelMatrix'
import Clients from './pages/Clients'
import ClientDetail from './pages/ClientDetail'

// Enhanced navigation items with icons
const navItems = [
  { 
    to: '/', 
    label: 'Dashboard', 
    icon: '📊',
    shortLabel: 'D'
  },
  { 
    to: '/white-labeled', 
    label: 'White-labeled', 
    icon: '🏷️',
    shortLabel: 'W'
  },
  { 
    to: '/clients', 
    label: 'Clients', 
    icon: '🏢',
    shortLabel: 'C'
  },
  { 
    to: '/users', 
    label: 'Users', 
    icon: '👥',
    shortLabel: 'U'
  }
]

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
    <div className={`app-grid bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300 ${sidebarCollapsed ? '[grid-template-columns:5rem_1fr]' : '[grid-template-columns:17rem_1fr]'}`}>
      {/* Enhanced Sidebar */}
      <aside className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${sidebarCollapsed ? 'p-3' : 'p-6'} flex flex-col`}>
        {/* Logo/Brand Section */}
        <div className="mb-8 flex items-center justify-center">
          {sidebarCollapsed ? (
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg" title="AI Linc Super Admin">
              <span className="text-white font-bold text-lg">AL</span>
            </div>
          ) : (
            <div className="text-center">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg mx-auto mb-2">
                <span className="text-white font-bold text-lg">AL</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Super Admin
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">AI Linc Portal</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex flex-col gap-2 ${sidebarCollapsed ? 'items-center' : ''} flex-1`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({isActive}) => 
                `group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm' 
                    : 'text-gray-700 dark:text-gray-300'
                }`
              }
              title={item.label}
            >
              {sidebarCollapsed ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                  <span className="text-lg">{item.icon}</span>
                </div>
              ) : (
                <>
                  <span className="text-lg">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </>
              )}
              
              {/* Active indicator */}
              {!sidebarCollapsed && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-l-full opacity-0 group-[.active]:opacity-100 transition-opacity" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer - Theme toggle when collapsed */}
        {sidebarCollapsed && (
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Toggle theme"
            >
              <span className="text-lg">{isDark ? '🌞' : '🌙'}</span>
            </button>
          </div>
        )}
      </aside>

      <main className="flex flex-col min-h-0">
        {/* Enhanced Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleSidebar}
                className="btn btn-secondary btn-sm"
                title="Toggle sidebar"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {sidebarCollapsed ? 'Expand' : 'Collapse'}
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Portal</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your AI Linc ecosystem</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-secondary btn-sm"
                title="Toggle theme"
              >
                <span className="mr-2">{isDark ? '🌞' : '🌙'}</span>
                {isDark ? 'Light' : 'Dark'} mode
              </button>
              
              {/* User avatar placeholder */}
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">SA</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-1 p-6 overflow-auto scrollbar-thin">
          <div className="card p-6 animate-fade-in">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/white-labeled" element={<WhiteLabelMatrix />} />
              <Route path="/white-labeled/:id" element={<OrganizationDetail />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:id" element={<ClientDetail />} />
              {/** Backward-compatible routes (not in menu) */}
              <Route path="/organizations" element={<Organizations />} />
              <Route path="/organizations/:id" element={<OrganizationDetail />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
