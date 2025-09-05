import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Course, CourseAssignment } from '../types'
import seedCourses from '../data/courses'

type Matrix = Record<string, Record<string, CourseAssignment>> // courseId -> orgId -> assignment

type Ctx = {
  courses: Course[]
  matrix: Matrix
  setEnabled: (courseId: string, orgId: string, enabled: boolean) => void
  setValue: (courseId: string, orgId: string, value: string) => void
  removeOrg: (orgId: string) => void
  reset: () => void
}

const STORAGE_KEY = 'org-course:matrix:v1'

const MatrixContext = createContext<Ctx | null>(null)

function load(): Matrix {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Matrix
  } catch {}
  return {}
}

function persist(m: Matrix) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(m)) } catch {}
}

export function CourseMatrixProvider({ children }: { children: ReactNode }) {
  const [courses] = useState<Course[]>(seedCourses)
  const [matrix, setMatrix] = useState<Matrix>(load)

  useEffect(() => { persist(matrix) }, [matrix])

  const setEnabled = useCallback((courseId: string, orgId: string, enabled: boolean) => {
    setMatrix(prev => {
      const next = { ...prev }
      const row = { ...(next[courseId] ?? {}) }
      const current = row[orgId] ?? { enabled: false }
      row[orgId] = { ...current, enabled, value: enabled ? current.value : undefined }
      next[courseId] = row
      return next
    })
  }, [])

  const setValue = useCallback((courseId: string, orgId: string, value: string) => {
    setMatrix(prev => {
      const next = { ...prev }
      const row = { ...(next[courseId] ?? {}) }
      const current = row[orgId] ?? { enabled: true }
      row[orgId] = { ...current, enabled: true, value }
      next[courseId] = row
      return next
    })
  }, [])

  const removeOrg = useCallback((orgId: string) => {
    setMatrix(prev => {
      const next: Matrix = {}
      for (const [courseId, row] of Object.entries(prev)) {
        const { [orgId]: _removed, ...rest } = row
        next[courseId] = rest
      }
      return next
    })
  }, [])

  const reset = useCallback(() => setMatrix({}), [])

  const value = useMemo(() => ({ courses, matrix, setEnabled, setValue, removeOrg, reset }), [courses, matrix, setEnabled, setValue, removeOrg, reset])
  return <MatrixContext.Provider value={value}>{children}</MatrixContext.Provider>
}

export function useCourseMatrix() {
  const ctx = useContext(MatrixContext)
  if (!ctx) throw new Error('useCourseMatrix must be used within CourseMatrixProvider')
  return ctx
}
