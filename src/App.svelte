<script lang="ts">
  import { onMount } from 'svelte'
  import profileDataRaw from './data/profile.json?raw'
  import skillsDataRaw from './data/skills.json?raw'
  import educationDataRaw from './data/education.json?raw'
  import experienceDataRaw from './data/experience.json?raw'
  import acronymDataRaw from './data/acronyms.json?raw'
  import projectDataRaw from './data/projects.json?raw'
  import PublicResume from './lib/PublicResume.svelte'
  import type { EducationItem, Profile, ProjectItem, ResumeItem, SkillGroup } from './lib/resumeTypes'

  let theme: 'light' | 'dark' | 'system' = 'light'
  let selectedSummary: string

  const profile = JSON.parse(profileDataRaw) as Profile
  const experience = JSON.parse(experienceDataRaw) as ResumeItem[]
  const projects = JSON.parse(projectDataRaw) as ProjectItem[]
  const skillGroups = JSON.parse(skillsDataRaw) as SkillGroup[]
  const education = JSON.parse(educationDataRaw) as EducationItem[]
  const acronyms = JSON.parse(acronymDataRaw) as Record<string, string>
  const lastUpdated = import.meta.env.VITE_LAST_COMMIT_DATE ?? 'No commits yet'
  const profileLinks = profile as Profile & { linkedin?: string; github?: string }

  const getEffectiveTheme = (currentTheme: 'light' | 'dark' | 'system'): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return currentTheme
  }

  const faviconHrefForTheme = (nextTheme: 'light' | 'dark' | 'system') => {
    const effectiveTheme = getEffectiveTheme(nextTheme)
    return `${import.meta.env.BASE_URL}favicon-${effectiveTheme}.svg`
  }

  const syncFavicon = (nextTheme: 'light' | 'dark' | 'system') => {
    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null
    if (favicon) {
      favicon.href = faviconHrefForTheme(nextTheme)
    }
  }

  const applyTheme = (nextTheme: 'light' | 'dark' | 'system') => {
    theme = nextTheme
    const effectiveTheme = getEffectiveTheme(nextTheme)
    document.documentElement.dataset.theme = effectiveTheme
    localStorage.setItem('theme', nextTheme)
    syncFavicon(nextTheme)
  }

  const pickRandomSummary = () => {
    const randomIndex = Math.floor(Math.random() * profile.summaries.length)
    selectedSummary = profile.summaries[randomIndex]
  }

  const toggleTheme = () => {
    const sequence: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = sequence.indexOf(theme)
    const nextTheme = sequence[(currentIndex + 1) % sequence.length]
    applyTheme(nextTheme)
  }

  const markdownFromResume = () => {
    const lines: string[] = []

    lines.push(`# ${profile.name}`)
    lines.push('')

    const meta = [
      profile.email && `Email: ${profile.email}`,
      profile.website && `Website: ${profile.website}`,
      profileLinks.linkedin && `LinkedIn: ${profileLinks.linkedin}`,
      profileLinks.github && `GitHub: ${profileLinks.github}`,
    ].filter(Boolean) as string[]

    if (meta.length > 0) {
      lines.push(meta.join(' | '))
      lines.push('')
    }

    lines.push('## Summaries')
    lines.push('')
    for (const summary of profile.summaries) {
      lines.push(`- ${summary}`)
    }
    lines.push('')

    lines.push('## Experience')
    for (const item of experience) {
      lines.push(`### ${item.role} - ${item['name-of-company']}`)
      lines.push(`${item.date} | ${item.location}`)
      for (const detail of item.details) {
        lines.push(`- ${detail}`)
      }
      lines.push('')
    }

    lines.push('## Projects')
    for (const item of projects) {
      lines.push(`### ${item.name}`)
      lines.push(`${item.date} | ${item.technologies.join(', ')}`)
      for (const detail of item.details) {
        lines.push(`- ${detail}`)
      }
      lines.push('')
    }

    lines.push('## Skills')
    for (const group of skillGroups) {
      lines.push(`- **${group.title}:** ${group.skills.join(', ')}`)
    }
    lines.push('')

    lines.push('## Education')
    for (const item of education) {
      lines.push(`- ${item.degree}, ${item.school} (${item.date})${item.location ? ` - ${item.location}` : ''}`)
    }

    return lines.join('\n')
  }

  const exportMarkdown = () => {
    const markdown = markdownFromResume()
    const file = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const href = URL.createObjectURL(file)
    const link = document.createElement('a')

    link.href = href
    link.download = 'resume-export.md'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(href)
  }

  onMount(() => {
    pickRandomSummary()

    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    const preferredTheme =
      storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
        ? storedTheme
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'

    applyTheme(preferredTheme)

    // Listen for OS theme preference changes when in system mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        const effectiveTheme = getEffectiveTheme('system')
        document.documentElement.dataset.theme = effectiveTheme
        syncFavicon('system')
      }
    }
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  })
</script>

<button class="brand-mark" type="button" aria-label="Export full resume as Markdown" on:click={exportMarkdown}>BL</button>

<button class="theme-toggle" type="button" aria-label="Toggle theme" on:click={toggleTheme} aria-pressed={theme === 'dark'}>
  <span aria-hidden="true">{theme === 'dark' ? '☼' : theme === 'light' ? '☾' : '◐'}</span>
  <span>{theme === 'dark' ? 'Light' : theme === 'light' ? 'Dark' : 'System'}</span>
</button>

<PublicResume
  profile={{ ...profile, summary: selectedSummary } as Profile}
  {experience}
  {projects}
  {skillGroups}
  {education}
  {acronyms}
  {lastUpdated}
/>
