import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useOrganizations } from '../state/organizations'
import { useCourseMatrix } from '../state/courseMatrix'
import ConfirmModal from '../components/ConfirmModal'

export default function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, update, remove } = useOrganizations()
  const org = getById(id!)

  const { courses, matrix, setEnabled, setValue, removeOrg } = useCourseMatrix()

  const [name, setName] = useState(org?.name ?? '')
  const [code, setCode] = useState(org?.code ?? '')
  const [domain, setDomain] = useState(org?.domain ?? '')
  const [logoUrl, setLogoUrl] = useState(org?.branding?.logoUrl ?? '')
  const [contactEmail, setContactEmail] = useState(org?.contactEmail ?? '')

  useEffect(() => {
    if (!org) return
    setName(org.name)
    setCode(org.code)
    setDomain(org.domain ?? '')
    setLogoUrl(org.branding?.logoUrl ?? '')
    setContactEmail(org.contactEmail ?? '')
  }, [org?.id])

  const missing = useMemo(() => !org, [org])
  if (missing) {
    return (
      <div className="grid gap-3">
        <div className="text-red-600">Client not found.</div>
        <Link className="text-indigo-600 hover:underline" to="/clients">Back to Clients</Link>
      </div>
    )
  }

  const saveClient = () => {
    update(org!.id, {
      name, code,
      domain: domain || undefined,
      whiteLabeled: true,
      branding: { logoUrl: logoUrl || undefined },
      contactEmail: contactEmail || undefined,
    })
  }

  // Delete confirmation
  const [showDelete, setShowDelete] = useState(false)

  // Add course state
  const enabledCourseIds = new Set(Object.entries(matrix).filter(([_, row]) => row[org!.id]?.enabled).map(([courseId]) => courseId))
  const availableCourses = courses.filter(c => !enabledCourseIds.has(c.id))
  const [addCourseId, setAddCourseId] = useState<string>('')
  const [addValue, setAddValue] = useState('')

  useEffect(() => {
    if (availableCourses.length > 0) setAddCourseId(availableCourses[0].id)
    else setAddCourseId('')
  }, [org?.id, availableCourses.length])

  function addCourse() {
    if (!addCourseId) return
    setEnabled(addCourseId, org!.id, true)
    if (addValue) setValue(addCourseId, org!.id, addValue)
    setAddValue('')
  }

  function CourseRow({ courseId }: { courseId: string }) {
    const course = courses.find(c => c.id === courseId)!
    const cell = matrix[courseId]?.[org!.id]
    const [enabledDraft, setEnabledDraft] = useState<boolean>(cell?.enabled ?? false)
    const [valueDraft, setValueDraft] = useState<string>(cell?.value ?? '')
    useEffect(() => { setEnabledDraft(cell?.enabled ?? false); setValueDraft(cell?.value ?? '') }, [cell?.enabled, cell?.value])
    const dirty = (enabledDraft !== (cell?.enabled ?? false)) || (valueDraft !== (cell?.value ?? ''))
    const save = () => { setEnabled(courseId, org!.id, enabledDraft); if (enabledDraft) setValue(courseId, org!.id, valueDraft) }
    const disable = () => { setEnabledDraft(false); setValueDraft('') }
    const isEnabled = enabledDraft
    return (
      <tr>
        <td className="py-2 pr-4 font-medium">{course.name}</td>
        <td className="py-2 pr-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={enabledDraft} onChange={e => setEnabledDraft(e.target.checked)} />
            <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
          </label>
        </td>
        <td className="py-2 pr-4">
          <input
            placeholder="free / 299 / 7000"
            value={valueDraft}
            onChange={e => setValueDraft(e.target.value)}
            disabled={!isEnabled}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-2 py-1 text-sm disabled:opacity-50"
          />
        </td>
        <td className="py-2">
          <div className="flex items-center gap-2">
            <button type="button" disabled={!dirty} onClick={save} className={`px-2 py-1 rounded text-xs ${dirty ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed'}`}>Save</button>
            {isEnabled && (
              <button type="button" onClick={disable} className="px-2 py-1 rounded text-xs border border-gray-200 dark:border-gray-700">Disable</button>
            )}
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {org!.branding?.logoUrl ? (
            <img src={org!.branding.logoUrl} alt="logo" className="h-8 w-auto" />
          ) : null}
          <div>
            <h3 className="text-lg font-semibold">{org!.name}</h3>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 px-2 py-0.5">{org!.code}</span>
              <span className="truncate max-w-[50vw] sm:max-w-none">{org!.domain ?? '-'}</span>
            </div>
            <div className="text-xs text-gray-500">Updated {new Date(org!.updatedAt).toLocaleString()}</div>
          </div>
        </div>
        <Link className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400" to="/clients" title="Back to Clients">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <span>Back</span>
        </Link>
      </div>

      <div className="grid gap-4 max-w-2xl">
        <h4 className="text-md font-semibold">Client Info</h4>
        <label className="grid gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Name</span>
          <input value={name} onChange={e=>setName(e.target.value)} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Code</span>
          <input value={code} onChange={e=>setCode(e.target.value)} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Domain/Subdomain</span>
          <input value={domain} onChange={e=>setDomain(e.target.value)} placeholder="e.g. college.ai-linc.app" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60" />
        </label>
        
        <label className="grid gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Logo URL</span>
          <input value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Contact Email</span>
          <input type="email" value={contactEmail} onChange={e=>setContactEmail(e.target.value)} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60" />
        </label>

        <div className="flex gap-3">
          <button type="button" onClick={saveClient} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/60">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V7h18v12a2 2 0 0 1-2 2z"></path><path d="M16 3v4"></path><path d="M8 3v4"></path><path d="M3 7h18"></path></svg>
            <span>Save Changes</span>
          </button>
          <button type="button" onClick={() => setShowDelete(true)} className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/60">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        <h4 className="text-md font-semibold">Courses</h4>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={addCourseId} onChange={e => setAddCourseId(e.target.value)} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60">
            {availableCourses.length === 0 && <option value="">No more courses available</option>}
            {availableCourses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            value={addValue}
            onChange={e => setAddValue(e.target.value)}
            placeholder="value (optional)"
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          />
          <button type="button" onClick={addCourse} disabled={!addCourseId} className={`px-3 py-2 rounded text-sm ${addCourseId ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed'}`}>Add Course</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/40">
              <tr>
                <th className="py-2 pr-4">Course</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Value</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {courses.map(c => (
                <CourseRow key={c.id} courseId={c.id} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={showDelete}
        title="Delete client?"
        message="This will remove the client and all its course assignments. You can’t undo this."
        confirmText="Delete"
        variant="danger"
        onConfirm={() => {
          remove(org!.id)
          removeOrg(org!.id)
          navigate('/clients')
        }}
        onClose={() => setShowDelete(false)}
      />
    </div>
  )
}

