export type Organization = {
  id: string
  name: string
  code: string // short code/slug (e.g., college code)
  domain?: string // custom domain or subdomain
  whiteLabeled: boolean
  branding?: {
    logoUrl?: string
  }
  contactEmail?: string
  createdAt: string
  updatedAt: string
}

export type Course = {
  id: string
  name: string
  code: string
}

export type CourseAssignment = {
  enabled: boolean
  value?: string // e.g., "free", "299", "7000"
}
