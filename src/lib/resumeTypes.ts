export type ResumeItem = {
  id: string
  'name-of-company': string
  companyUrl?: string
  role: string
  location: string
  date: string
  details: string[]
}

export type ProjectItem = {
  id: string
  name: string
  technologies: string[]
  date: string
  details: string[]
  links?: Array<{ label: string; href: string }>
}

export type Profile = {
  name: string
  email?: string
  website?: string
  linkedin?: string
  github?: string
  summaries: string[]
  summary?: string
}

export type SkillGroup = {
  title: string
  skills: string[]
}

export type EducationItem = {
  id: string
  school: string
  degree: string
  location: string
  date: string
  minor?: string
}
