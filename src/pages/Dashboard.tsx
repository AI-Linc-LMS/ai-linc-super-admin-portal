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
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-xl font-semibold">Dashboard</h3>
        <div className="flex items-center gap-2">
          <Link to="/clients" className="inline-flex items-center gap-2 px-3 py-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <span>Manage Clients</span>
          </Link>
          <Link to="/white-labeled" className="inline-flex items-center gap-2 px-3 py-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <span>White-labeled Matrix</span>
          </Link>
          <button
            type="button"
            onClick={() => addSampleClients(5)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            title="Add sample clients"
          >
            + Add 5 Samples
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="text-sm text-gray-500">Total Organizations</div>
          <div className="mt-1 text-2xl font-semibold">{totalOrgs}</div>
          <div className="mt-1 text-xs text-gray-500">Last update {latestUpdated ? new Date(latestUpdated).toLocaleString() : '-'}</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="text-sm text-gray-500">Clients</div>
          <div className="mt-1 text-2xl font-semibold text-green-600">{wlCount}</div>
          <div className="mt-1 text-xs text-gray-500">{pct(wlCount, totalOrgs)}% of orgs</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="text-sm text-gray-500">Courses</div>
          <div className="mt-1 text-2xl font-semibold text-indigo-600">{totalCourses}</div>
          <div className="mt-1 text-xs text-gray-500">Assignments enabled {enabledAssignments}</div>
        </div>
        
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-semibold">Recent Updates</h4>
            <Link to="/clients" className="text-sm text-indigo-600 hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {recent.map(o => (
              <li key={o.id} className="py-3 flex items-center gap-3">
                {o.branding?.logoUrl ? (
                  <img src={o.branding.logoUrl} alt="logo" className="h-8 w-8 rounded bg-white object-contain" />
                ) : (
                  <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />)
                }
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{o.name}</span>
                    <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-xs">{o.code}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{o.domain ?? '-'}</div>
                </div>
                <div className="ml-auto text-xs text-gray-500">{new Date(o.updatedAt).toLocaleString()}</div>
              </li>
            ))}
            {recent.length === 0 && (
              <li className="py-6 text-center text-sm text-gray-500">No organizations yet.</li>
            )}
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-semibold">Top Courses</h4>
            <span className="text-xs text-gray-500">Across {totalOrgs} orgs</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/40">
                <tr>
                  <th className="py-2 pr-4">Course</th>
                  <th className="py-2 pr-4">Enabled</th>
                  <th className="py-2">Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {topCourses.map(tc => (
                  <tr key={tc.id}>
                    <td className="py-2 pr-4">{tc.name}</td>
                    <td className="py-2 pr-4">{tc.count}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <div className="h-2 bg-indigo-600" style={{ width: `${pct(tc.count, totalOrgs)}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-10">{pct(tc.count, totalOrgs)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {topCourses.length === 0 && (
                  <tr><td className="py-6 text-center text-sm text-gray-500" colSpan={3}>No courses yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}



