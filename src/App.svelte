<script lang="ts">
  import { onMount } from 'svelte'
  import profileDataRaw from './data/profile.json?raw'
  import skillsDataRaw from './data/skills.json?raw'
  import educationDataRaw from './data/education.json?raw'
  import experienceDataRaw from './data/experience.json?raw'
  import acronymDataRaw from './data/acronyms.json?raw'
  import projectDataRaw from './data/projects.json?raw'
  import PublicResume from './lib/PublicResume.svelte'
  import InternalResumeGenerator from './lib/InternalResumeGenerator.svelte'
  import type { EducationItem, Profile, ProjectItem, ResumeItem, SkillGroup } from './lib/resumeTypes'

  let route: '/home' | '/internal' = '/home'
  let theme: 'light' | 'dark' = 'light'

  const applyTheme = (nextTheme: 'light' | 'dark') => {
    theme = nextTheme
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('theme', nextTheme)
  }

  const toggleTheme = () => {
    applyTheme(theme === 'light' ? 'dark' : 'light')
  }

  const syncRouteFromPath = () => {
    route = window.location.pathname === '/internal' ? '/internal' : '/home'
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
    syncRouteFromPath()
    window.addEventListener('popstate', syncRouteFromPath)
    return () => window.removeEventListener('popstate', syncRouteFromPath)
  })

  const profile = JSON.parse(profileDataRaw) as Profile
  const experience = JSON.parse(experienceDataRaw) as ResumeItem[]
  const projects = JSON.parse(projectDataRaw) as ProjectItem[]
  const skillGroups = JSON.parse(skillsDataRaw) as SkillGroup[]
  const education = JSON.parse(educationDataRaw) as EducationItem[]
  const acronyms = JSON.parse(acronymDataRaw) as Record<string, string>
</script>

<button class="theme-toggle" type="button" aria-label="Toggle theme" on:click={toggleTheme} aria-pressed={theme === 'dark'}>
  <span aria-hidden="true">{theme === 'dark' ? '☼' : '☾'}</span>
  <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
</button>

{#if route === '/internal'}
  <InternalResumeGenerator
    {profile}
    {experience}
    {projects}
    {skillGroups}
    {education}
    {acronyms}
  />
{:else}
  <PublicResume {profile} {experience} {projects} {skillGroups} {education} {acronyms} />
{/if}
