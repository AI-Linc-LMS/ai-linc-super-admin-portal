import { Link } from 'react-router-dom'
import { useOrganizations } from '../state/organizations'
import { useCourseMatrix } from '../state/courseMatrix'

export default function Dashboard() {
  const { organizations, addSampleClients } = useOrganizations()
  const { courses, matrix } = useCourseMatrix()

  const totalOrgs = organizations.length
  // All orgs are Clients
  const wlCount = totalOrgs
  const totalCourses = courses.length

  let enabledAssignments = 0
  for (const course of courses) {
    const row = matrix[course.id] ?? {}
    for (const orgId of Object.keys(row)) {
      if (row[orgId]?.enabled) enabledAssignments++
    }
  }

  const latestUpdated = organizations
    .map(o => o.updatedAt)
    .sort()
    .slice(-1)[0]

  // Recent organizations by updated time
  const recent = [...organizations]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 5)

  // Top courses by number of enabled orgs
  const topCourses = courses
    .map(c => {
      const row = matrix[c.id] ?? {}
      const count = Object.values(row).filter(cell => cell?.enabled).length
      return { id: c.id, name: c.name, count }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const pct = (n: number, d: number) => (d === 0 ? 0 : Math.round((n / d) * 100))

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Overview of your AI Linc ecosystem</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/clients" className="btn btn-secondary btn-md">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m0 0h1m0 0h1M9 7v1m0 0v1m0-1h1m0 0v1" />
            </svg>
            Manage Clients
          </Link>
          {/* <Link to="/white-labeled" className="btn btn-secondary btn-md">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Matrix View
          </Link> */}
          <button
            type="button"
            onClick={() => addSampleClients(5)}
            className="btn btn-primary btn-md"
            title="Add sample clients"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add 5 Samples
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Organizations</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{totalOrgs}</p>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-2">
                {latestUpdated ? `Updated ${new Date(latestUpdated).toLocaleDateString()}` : 'No updates yet'}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m0 0h1m0 0h1M9 7v1m0 0v1m0-1h1m0 0v1" />
              </svg>
            </div>
          </div>
        </div> */}

        <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Clients</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">{wlCount}</p>
              <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-2">
                {pct(wlCount, totalOrgs)}% of Clients
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Available Courses</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">{totalCourses}</p>
              <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-2">
                {enabledAssignments} assignments active
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Updates Card */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Updates</h4>
              <Link to="/clients" className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium">
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recent.map((o, index) => (
                <div key={o.id} className={`flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
                  {o.branding?.logoUrl ? (
                    <img src={o.branding.logoUrl} alt="logo" className="h-10 w-10 rounded-lg bg-white object-contain shadow-sm" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{o.code.slice(0, 2)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100 truncate">{o.name}</span>
                      <span className="badge badge-gray">{o.code}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">{o.domain || 'No domain set'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(o.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {recent.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m0 0h1m0 0h1M9 7v1m0 0v1m0-1h1m0 0v1" />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No organizations yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Courses Card */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Courses</h4>
              <span className="badge badge-info">{totalOrgs} organizations</span>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topCourses.map((tc, index) => (
                <div key={tc.id} className={`flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">{tc.name.slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{tc.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{tc.count} enabled</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct(tc.count, totalOrgs)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-10">
                      {pct(tc.count, totalOrgs)}%
                    </span>
                  </div>
                </div>
              ))}
              {topCourses.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No courses yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



