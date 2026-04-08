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

  let theme: 'light' | 'dark' = 'light'

  const faviconHrefForTheme = (nextTheme: 'light' | 'dark') => `${import.meta.env.BASE_URL}favicon-${nextTheme}.svg`

  const syncFavicon = (nextTheme: 'light' | 'dark') => {
    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null
    if (favicon) {
      favicon.href = faviconHrefForTheme(nextTheme)
    }
  }

  const applyTheme = (nextTheme: 'light' | 'dark') => {
    theme = nextTheme
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('theme', nextTheme)
    syncFavicon(nextTheme)
  }

  const toggleTheme = () => {
    applyTheme(theme === 'light' ? 'dark' : 'light')
  }

  onMount(() => {
    const storedTheme = localStorage.getItem('theme')
    const preferredTheme =
      storedTheme === 'light' || storedTheme === 'dark'
        ? storedTheme
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'

    applyTheme(preferredTheme)
  })

  const profile = JSON.parse(profileDataRaw) as Profile
  const experience = JSON.parse(experienceDataRaw) as ResumeItem[]
  const projects = JSON.parse(projectDataRaw) as ProjectItem[]
  const skillGroups = JSON.parse(skillsDataRaw) as SkillGroup[]
  const education = JSON.parse(educationDataRaw) as EducationItem[]
  const acronyms = JSON.parse(acronymDataRaw) as Record<string, string>
  const lastUpdated = import.meta.env.VITE_LAST_COMMIT_DATE ?? 'No commits yet'
</script>

<div class="brand-mark" aria-hidden="true">BL</div>

<button class="theme-toggle" type="button" aria-label="Toggle theme" on:click={toggleTheme} aria-pressed={theme === 'dark'}>
  <span aria-hidden="true">{theme === 'dark' ? '☼' : '☾'}</span>
  <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
</button>

<PublicResume
  {profile}
  {experience}
  {projects}
  {skillGroups}
  {education}
  {acronyms}
  {lastUpdated}
/>
