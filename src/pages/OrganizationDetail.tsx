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
        <Link className="inline-flex items-center w-fit text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600 rounded px-3 py-1.5 transition-colors" to={backBase}>Back to {backBase === '/white-labeled' ? 'White-labeled' : 'Organizations'}</Link>
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
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{org!.name}</h3>
          <div className="text-xs text-gray-500">Updated {new Date(org!.updatedAt).toLocaleString()}</div>
        </div>
        <Link className="inline-flex items-center w-fit text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600 rounded px-3 py-1.5 transition-colors" to={backBase}>Back to {backBase === '/white-labeled' ? 'White-labeled' : 'Organizations'}</Link>
      </div>

      <div className="grid gap-6 max-w-3xl">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1" htmlFor="org-name">
            <span className="text-sm text-gray-700 dark:text-gray-300">Name</span>
            <input id="org-name" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </label>
          <label className="grid gap-1" htmlFor="org-code">
            <span className="text-sm text-gray-700 dark:text-gray-300">Code</span>
            <input id="org-code" value={code} onChange={e => setCode(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </label>
          <label className="grid gap-1 md:col-span-2" htmlFor="org-domain">
            <span className="text-sm text-gray-700 dark:text-gray-300">Domain/Subdomain</span>
            <input id="org-domain" value={domain} onChange={e => setDomain(e.target.value)} placeholder="e.g. college.ai-linc.app" className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="inline-flex items-center gap-2" htmlFor="org-white-labeled">
            <input id="org-white-labeled" className="h-4 w-4" type="checkbox" checked={whiteLabeled} onChange={e => setWhiteLabeled(e.target.checked)} />
            <span className="text-sm">White-labeled</span>
          </label>
          <div className="hidden md:block" />
          <label className="grid gap-1" htmlFor="org-logo-url">
            <span className="text-sm text-gray-700 dark:text-gray-300">Logo URL</span>
            <input id="org-logo-url" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </label>
          <label className="grid gap-1" htmlFor="org-contact-email">
            <span className="text-sm text-gray-700 dark:text-gray-300">Contact Email</span>
            <input id="org-contact-email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={save} className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Save Changes</button>
          <button type="button" onClick={deleteOrg} className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">Delete</button>
        </div>
      </div>
      <ConfirmModal
        open={showDelete}
        title="Delete organization?"
        message="This will remove the organization and all its matrix assignments. You can’t undo this."
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
