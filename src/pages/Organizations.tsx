import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useOrganizations } from '../state/organizations'

type Props = {
  mode?: 'all' | 'white-labeled'
}

export default function Organizations({ mode = 'all' }: Props) {
  const { organizations } = useOrganizations()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all'|'wl'|'non-wl'>(mode === 'white-labeled' ? 'wl' : 'all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return organizations
      .filter(o => {
        if (filter === 'wl' && !o.whiteLabeled) return false
        if (filter === 'non-wl' && o.whiteLabeled) return false
        if (!q) return true
        return (
          o.name.toLowerCase().includes(q) ||
          o.code.toLowerCase().includes(q) ||
          (o.domain?.toLowerCase().includes(q) ?? false)
        )
      })
  }, [organizations, query, filter])

  const wlCount = organizations.filter(o => o.whiteLabeled).length

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{mode === 'white-labeled' ? 'White-labeled' : 'Organizations'}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {wlCount} white-labeled / {organizations.length - wlCount} not white-labeled
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search name, code, domain"
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2"
        />
        <div className="flex items-center gap-2 text-sm">
          <label className="inline-flex items-center gap-1">
            <input type="radio" name="filter" checked={filter==='all'} onChange={() => setFilter('all')} /> All
          </label>
          <label className="inline-flex items-center gap-1">
            <input type="radio" name="filter" checked={filter==='wl'} onChange={() => setFilter('wl')} /> White-labeled
          </label>
          <label className="inline-flex items-center gap-1">
            <input type="radio" name="filter" checked={filter==='non-wl'} onChange={() => setFilter('non-wl')} /> Not WL
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Code</th>
              <th className="py-2">Domain</th>
              <th className="py-2">White-Labeled</th>
              <th className="py-2">Updated</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map(org => (
              <tr key={org.id}>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    {org.branding?.logoUrl ? (
                      <img src={org.branding.logoUrl} alt="logo" className="h-6 w-auto" />
                    ) : (
                      <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
                    )}
                    <div className="font-medium">{org.name}</div>
                  </div>
                </td>
                <td className="py-2">{org.code}</td>
                <td className="py-2">{org.domain ?? '—'}</td>
                <td className="py-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${org.whiteLabeled ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                    {org.whiteLabeled ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="py-2 text-xs text-gray-500">{new Date(org.updatedAt).toLocaleString()}</td>
                <td className="py-2">
                  <Link className="text-indigo-600 hover:underline" to={`${mode === 'white-labeled' ? '/white-labeled' : '/organizations'}/${org.id}`}>Manage</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
