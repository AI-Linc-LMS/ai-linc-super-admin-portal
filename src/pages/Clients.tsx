import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useOrganizations } from '../state/organizations'
import { useCourseMatrix } from '../state/courseMatrix'

export default function Clients() {
  const { organizations } = useOrganizations()
  const { matrix, courses } = useCourseMatrix()
  const [query, setQuery] = useState('')

  const whiteLabeled = useMemo(() => organizations.filter(o => o.whiteLabeled), [organizations])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return whiteLabeled
    return whiteLabeled.filter(o =>
      o.name.toLowerCase().includes(q) ||
      o.code.toLowerCase().includes(q) ||
      (o.domain?.toLowerCase().includes(q) ?? false)
    )
  }, [whiteLabeled, query])

  function getEnabledCount(orgId: string) {
    let count = 0
    for (const course of courses) {
      if (matrix[course.id]?.[orgId]?.enabled) count++
    }
    return count
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-lg font-semibold">Clients</h3>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search clients (name/code/domain)"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(org => (
          <Link key={org.id} to={`/clients/${org.id}`} className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow transition-shadow">
            <div className="flex items-center gap-3">
              {org.branding?.logoUrl ? (
                <img src={org.branding.logoUrl} alt="logo" className="h-8 w-auto" />
              ) : (
                <div className="h-8 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
              )}
              <div>
                <div className="font-medium">{org.name}</div>
                <div className="text-xs text-gray-500">{org.code} · {org.domain ?? '—'}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Courses enabled</span>
              <span className="font-medium">{getEnabledCount(org.id)}</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">Updated {new Date(org.updatedAt).toLocaleString()}</div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-gray-500">No clients found.</div>
        )}
      </div>
    </div>
  )
}

