import { createContext, useContext, useMemo, useState, useCallback, ReactNode, useEffect } from 'react'
import type { Organization } from '../types'
import seed from '../data/organizations'

type OrgContextShape = {
  organizations: Organization[]
  create: (org: Omit<Organization, 'id'|'createdAt'|'updatedAt'>) => Organization
  update: (id: string, patch: Partial<Organization>) => void
  remove: (id: string) => void
  getById: (id: string) => Organization | undefined
  resetToSeed: () => void
  addSampleClients: (count: number) => void
}

const OrgContext = createContext<OrgContextShape | null>(null)

const STORAGE_KEY = 'orgs:store:v1'

function loadInitial(): Organization[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Organization[]
  } catch {}
  return seed
}

function persist(orgs: Organization[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orgs))
  } catch {}
}

export function OrganizationsProvider({ children }: { children: ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>(loadInitial)

  useEffect(() => {
    persist(organizations)
  }, [organizations])

  const create: OrgContextShape['create'] = useCallback((org) => {
    const now = new Date().toISOString()
    const created: Organization = {
      ...org,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    setOrganizations(prev => [created, ...prev])
    return created
  }, [])

  const update: OrgContextShape['update'] = useCallback((id, patch) => {
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, ...patch, updatedAt: new Date().toISOString() } : o))
  }, [])

  const remove: OrgContextShape['remove'] = useCallback((id) => {
    setOrganizations(prev => prev.filter(o => o.id !== id))
  }, [])

  const getById = useCallback((id: string) => organizations.find(o => o.id === id), [organizations])

  const resetToSeed = useCallback(() => {
    setOrganizations(seed)
  }, [])

  const addSampleClients = useCallback((count: number) => {
    const palette = ['16a34a','1d4ed8','f59e0b','10b981','3b82f6','ef4444','8b5cf6','06b6d4','0ea5e9','22c55e','f97316','3f83f8','64748b']
    const now = new Date().toISOString()
    setOrganizations(prev => {
      const next = [...prev]
      for (let i = 0; i < count; i++) {
        const idx = next.length + 1
        const color = palette[idx % palette.length]
        next.push({
          id: crypto.randomUUID(),
          name: `Sample College ${idx}`,
          code: `SC${idx}`,
          domain: `sc${idx}.ai-linc.app`,
          whiteLabeled: true,
          branding: { logoUrl: `https://dummyimage.com/120x40/${color}/ffffff&text=SC${idx}` },
          contactEmail: `admin+sc${idx}@example.com`,
          createdAt: now,
          updatedAt: now,
        })
      }
      return next
    })
  }, [])

  const value = useMemo(() => ({ organizations, create, update, remove, getById, resetToSeed, addSampleClients }), [organizations, create, update, remove, getById, resetToSeed, addSampleClients])

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}

export function useOrganizations() {
  const ctx = useContext(OrgContext)
  if (!ctx) throw new Error('useOrganizations must be used within OrganizationsProvider')
  return ctx
}
