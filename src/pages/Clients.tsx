import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useOrganizations } from '../state/organizations'
import { useCourseMatrix } from '../state/courseMatrix'

export default function Clients() {
  const { organizations } = useOrganizations()
  const { matrix, courses } = useCourseMatrix()
  const [query, setQuery] = useState('')

  // Show all organizations as clients (no WL filtering)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return organizations
    return organizations.filter(o =>
      o.name.toLowerCase().includes(q) ||
      o.code.toLowerCase().includes(q) ||
      (o.domain?.toLowerCase().includes(q) ?? false)
    )
  }, [organizations, query])

  function getEnabledCount(orgId: string) {
    let count = 0
    for (const course of courses) {
      if (matrix[course.id]?.[orgId]?.enabled) count++
    }
    return count
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-xl font-semibold">Clients</h3>
          <p className="text-sm text-gray-500">{filtered.length} of {organizations.length} visible | Manage clients</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {/* search icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, code or domain"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded pl-9 pr-9 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Clear search"
                title="Clear"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(org => (
          <Link
            key={org.id}
            to={`/clients/${org.id}`}
            className="group block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {org.branding?.logoUrl ? (
                  <img src={org.branding.logoUrl} alt="logo" className="h-9 w-9 rounded bg-white object-contain" />
                ) : (
                  <div className="h-9 w-9 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500">—</div>
                )}
                <div className="min-w-0">
                  <div className="font-medium truncate">{org.name}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                    <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 px-2 py-0.5">{org.code}</span>
                    <span className="truncate">{org.domain ?? '-'}</span>
                  </div>
                </div>
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">&gt;</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Courses enabled</span>
              <span className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-0.5 text-xs font-medium">
                {getEnabledCount(org.id)}
              </span>
            </div>
            <div className="mt-1 text-xs text-gray-500">Updated {new Date(org.updatedAt).toLocaleString()}</div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-gray-500">
            No clients found. Try a different search.
          </div>
        )}
      </div>
    </div>
  )
}
