import { useOrganizations } from '../state/organizations'

export default function Dashboard() {
  const { organizations } = useOrganizations()
  const total = organizations.length
  const wl = organizations.filter(o => o.whiteLabeled).length
  const nonWl = total - wl

  return (
    <div className="grid gap-6">
      <h3 className="text-lg font-semibold">Dashboard</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="text-sm text-gray-500">Total Organizations</div>
          <div className="text-2xl font-semibold">{total}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="text-sm text-gray-500">White-labeled</div>
          <div className="text-2xl font-semibold text-green-600">{wl}</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <div className="text-sm text-gray-500">Not White-labeled</div>
          <div className="text-2xl font-semibold text-gray-600">{nonWl}</div>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300">Manage white-label status and branding under Organizations.</p>
    </div>
  )
}
