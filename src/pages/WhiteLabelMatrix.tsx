import { useEffect, useMemo, useState } from 'react'
import { useOrganizations } from '../state/organizations'
import { useCourseMatrix } from '../state/courseMatrix'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'

export default function WhiteLabelMatrix() {
  const { organizations, remove, update, resetToSeed, addSampleClients } = useOrganizations()
  const wlOrgs = useMemo(() => organizations.filter(o => o.whiteLabeled), [organizations])
  const { courses, matrix, setEnabled, setValue, reset, removeOrg } = useCourseMatrix()

  // Client filtering + pagination (handle many clients)
  const [orgQuery, setOrgQuery] = useState('')
  const filteredWlOrgs = useMemo(() => {
    const q = orgQuery.trim().toLowerCase()
    if (!q) return wlOrgs
    return wlOrgs.filter(o => o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q))
  }, [wlOrgs, orgQuery])
  const [pageSize, setPageSize] = useState(6)
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(filteredWlOrgs.length / pageSize))
  useEffect(() => { if (page > totalPages) setPage(totalPages) }, [totalPages, page])
  const visibleOrgs = useMemo(() => {
    if (orgQuery) return filteredWlOrgs // show all when searching
    const start = (page - 1) * pageSize
    return filteredWlOrgs.slice(start, start + pageSize)
  }, [filteredWlOrgs, page, pageSize, orgQuery])

  // Edit modal state
  const [editingId, setEditingId] = useState<string | null>(null)
  const editing = useMemo(() => wlOrgs.find(o => o.id === editingId) || organizations.find(o => o.id === editingId) || null, [editingId, wlOrgs, organizations])
  const [form, setForm] = useState({ name: '', code: '', domain: '', whiteLabeled: true, logoUrl: '', contactEmail: '' })
  useEffect(() => {
    if (!editing) return
    setForm({
      name: editing.name,
      code: editing.code,
      domain: editing.domain ?? '',
      whiteLabeled: editing.whiteLabeled,
      logoUrl: editing.branding?.logoUrl ?? '',
      contactEmail: editing.contactEmail ?? '',
    })
  }, [editing])

  function saveEdit() {
    if (!editing) return
    update(editing.id, {
      name: form.name,
      code: form.code,
      domain: form.domain || undefined,
      whiteLabeled: form.whiteLabeled,
      branding: { logoUrl: form.logoUrl || undefined },
      contactEmail: form.contactEmail || undefined,
    })
    setEditingId(null)
  }

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const toDelete = useMemo(() => organizations.find(o => o.id === deleteId) || null, [deleteId, organizations])

  function MatrixCell({ courseId, orgId }: { courseId: string, orgId: string }) {
    const cell = matrix[courseId]?.[orgId]
    const [enabledDraft, setEnabledDraft] = useState<boolean>(cell?.enabled ?? false)
    const [valueDraft, setValueDraft] = useState<string>(cell?.value ?? '')
    useEffect(() => { setEnabledDraft(cell?.enabled ?? false); setValueDraft(cell?.value ?? '') }, [cell?.enabled, cell?.value])

    const dirty = (enabledDraft !== (cell?.enabled ?? false)) || (valueDraft !== (cell?.value ?? ''))

    function save() {
      setEnabled(courseId, orgId, enabledDraft)
      if (enabledDraft) setValue(courseId, orgId, valueDraft)
    }

    return (
      <div className="grid gap-1">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={enabledDraft} onChange={e => setEnabledDraft(e.target.checked)} />
          <span className="text-xs text-gray-600 dark:text-gray-300">{enabledDraft ? 'Enabled' : 'Disabled'}</span>
        </label>
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">₹</span>
            <input
              placeholder="Numbers only (e.g. 299)"
              value={valueDraft}
              inputMode="decimal"
              pattern="[0-9]*[.]?[0-9]*"
              onChange={e => {
                const raw = e.target.value
                const cleaned = raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
                setValueDraft(cleaned)
              }}
              disabled={!enabledDraft}
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded pl-6 pr-2 py-1 text-sm disabled:opacity-50 w-full"
            />
          </div>
          <button
            type="button"
            disabled={!dirty}
            onClick={save}
            className={`px-2 py-1 rounded text-xs ${dirty ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed'}`}
          >
            Save
          </button>
          {enabledDraft && (
            <button type="button" onClick={() => { setEnabledDraft(false); setValueDraft('') }} className="px-2 py-1 rounded text-xs border border-gray-200 dark:border-gray-700">Disable</button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-lg font-semibold">White-labeled Matrix</h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">{courses.length} courses × {wlOrgs.length} clients</span>
          <input
            value={orgQuery}
            onChange={e => { setOrgQuery(e.target.value); setPage(1) }}
            placeholder="Search clients"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-2 py-1"
          />
          {!orgQuery && (
            <div className="flex items-center gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 disabled:opacity-50">Prev</button>
              <span>Page {page} / {totalPages}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 disabled:opacity-50">Next</button>
              <select value={pageSize} onChange={e => { setPageSize(parseInt(e.target.value)); setPage(1) }} className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                <option value={4}>4 cols</option>
                <option value={6}>6 cols</option>
                <option value={8}>8 cols</option>
                <option value={12}>12 cols</option>
              </select>
            </div>
          )}
          <button type="button" onClick={() => { addSampleClients(10) }} className="px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Add 10 sample clients</button>
          <button type="button" onClick={() => { resetToSeed(); reset(); }} className="px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Reset sample data</button>
          <button type="button" onClick={reset} className="px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Clear all cells</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 sticky top-0 z-10 bg-white dark:bg-gray-800">
            <tr>
              <th className="py-2 pr-4 sticky left-0 z-20 bg-white dark:bg-gray-800">Courses</th>
              {visibleOrgs.map(org => (
                <th key={org.id} className="py-2 px-2 whitespace-nowrap align-bottom">
                  <div className="flex items-center gap-2">
                    {org.branding?.logoUrl ? (
                      <img src={org.branding.logoUrl} alt="logo" className="h-5 w-auto" />
                    ) : null}
                    <span>{org.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <button className="text-indigo-600 hover:underline" onClick={() => setEditingId(org.id)}>Edit</button>
                    <button type="button" onClick={() => setDeleteId(org.id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {courses.map(course => (
              <tr key={course.id}>
                <td className="py-2 pr-4 font-medium sticky left-0 z-10 bg-white dark:bg-gray-800">{course.name}</td>
                {visibleOrgs.map(org => (
                  <td key={org.id} className="py-2 px-2 align-top">
                    <MatrixCell courseId={course.id} orgId={org.id} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">Tip: Use the search box to filter clients. When not searching, paginate columns using Prev/Next. You can also horizontally scroll if needed.</p>

      <Modal
        open={!!editing}
        title={editing ? `Edit ${editing.name}` : 'Edit'}
        onClose={() => setEditingId(null)}
        footer={(
          <>
            <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700">Cancel</button>
            <button onClick={saveEdit} className="px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
          </>
        )}
      >
        {editing && (
          <div className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-sm">Name</span>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded px-3 py-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Code</span>
              <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded px-3 py-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Domain</span>
              <input value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded px-3 py-2" />
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={form.whiteLabeled} onChange={e => setForm(f => ({ ...f, whiteLabeled: e.target.checked }))} />
              <span>White-labeled</span>
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Logo URL</span>
              <input value={form.logoUrl} onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded px-3 py-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Contact Email</span>
              <input type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded px-3 py-2" />
            </label>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!toDelete}
        title={toDelete ? `Delete ${toDelete.name}?` : 'Delete'}
        message="This will remove the client and all its matrix assignments. You can’t undo this."
        confirmText="Delete"
        variant="danger"
        onConfirm={() => {
          if (!toDelete) return
          remove(toDelete.id)
          removeOrg(toDelete.id)
          setDeleteId(null)
        }}
        onClose={() => setDeleteId(null)}
      />
    </div>
  )
}
