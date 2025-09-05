import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useOrganizations } from '../state/organizations'
import { useCourseMatrix } from '../state/courseMatrix'
import ConfirmModal from '../components/ConfirmModal'

export default function OrganizationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, update, remove } = useOrganizations()
  const org = getById(id!)
  const location = useLocation()
  const backBase = location.pathname.startsWith('/white-labeled') ? '/white-labeled' : '/organizations'
  const { removeOrg } = useCourseMatrix()

  const [name, setName] = useState(org?.name ?? '')
  const [code, setCode] = useState(org?.code ?? '')
  const [domain, setDomain] = useState(org?.domain ?? '')
  const [whiteLabeled, setWhiteLabeled] = useState(org?.whiteLabeled ?? false)
  const [logoUrl, setLogoUrl] = useState(org?.branding?.logoUrl ?? '')
  const [contactEmail, setContactEmail] = useState(org?.contactEmail ?? '')

  const missing = useMemo(() => !org, [org])

  if (missing) {
    return (
      <div className="grid gap-3">
        <div className="text-red-600">Organization not found.</div>
        <Link className="text-indigo-600 hover:underline" to="/organizations">Back to list</Link>
      </div>
    )
  }

  const save = () => {
    update(org!.id, {
      name, code,
      domain: domain || undefined,
      whiteLabeled,
      branding: { logoUrl: logoUrl || undefined },
      contactEmail: contactEmail || undefined,
    })
  }

  const [showDelete, setShowDelete] = useState(false)
  const deleteOrg = () => setShowDelete(true)

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{org!.name}</h3>
          <div className="text-xs text-gray-500">Updated {new Date(org!.updatedAt).toLocaleString()}</div>
        </div>
        <Link className="text-indigo-600 hover:underline" to={backBase}>Back to {backBase === '/white-labeled' ? 'White-labeled' : 'Organizations'}</Link>
      </div>

      <div className="grid gap-4 max-w-2xl">
        <label className="grid gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Name</span>
          <input value={name} onChange={e=>setName(e.target.value)} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Code</span>
          <input value={code} onChange={e=>setCode(e.target.value)} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Domain/Subdomain</span>
          <input value={domain} onChange={e=>setDomain(e.target.value)} placeholder="e.g. college.ai-linc.app" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2" />
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={whiteLabeled} onChange={e=>setWhiteLabeled(e.target.checked)} />
          <span>White-labeled</span>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Logo URL</span>
          <input value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-300">Contact Email</span>
          <input type="email" value={contactEmail} onChange={e=>setContactEmail(e.target.value)} className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2" />
        </label>

        <div className="flex gap-3">
          <button type="button" onClick={save} className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Save Changes</button>
          <button type="button" onClick={deleteOrg} className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
        </div>
      </div>
      <ConfirmModal
        open={showDelete}
        title="Delete organization?"
        message="This will remove the client and all its matrix assignments. You can’t undo this."
        confirmText="Delete"
        variant="danger"
        onConfirm={() => {
          remove(org!.id)
          removeOrg(org!.id)
          navigate(backBase)
        }}
        onClose={() => setShowDelete(false)}
      />
    </div>
  )
}
