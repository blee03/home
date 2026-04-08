<script lang="ts">
  import type {
    EducationItem,
    Profile,
    ProjectItem,
    ResumeItem,
    SkillGroup,
  } from './resumeTypes'

  export let profile: Profile
  export let acronyms: Record<string, string>
  export let experience: ResumeItem[]
  export let projects: ProjectItem[]
  export let skillGroups: SkillGroup[]
  export let education: EducationItem[]
  export let lastUpdated: string | undefined
  export let internalHref: string = '/internal'

  const displayLastUpdated = lastUpdated ?? import.meta.env.VITE_LAST_COMMIT_DATE ?? 'No commits yet'

  const acronymEntries = Object.entries(acronyms).sort((left, right) => right[0].length - left[0].length)
  const acronymPattern = new RegExp(
    `\\b(${acronymEntries.map(([acronym]) => acronym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'g',
  )

  const escapeHtml = (input: string) =>
    input
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')

  const formatDetail = (text: string) => {
    const escaped = escapeHtml(text)
    const emphasized = escaped.replace(/\*\*(.*?)\*\*/g, '<strong class="emphasis">$1</strong>')
    return emphasized.replace(acronymPattern, (match) => {
      const label = acronyms[match]
      return `<abbr class="acronym" title="${escapeHtml(label)}">${match}</abbr>`
    })
  }

  const formatSummary = (text: string) => {
    const escaped = escapeHtml(text)
    return escaped.replace(acronymPattern, (match) => {
      const label = acronyms[match]
      return `<abbr class="acronym" title="${escapeHtml(label)}">${match}</abbr>`
    })
  }

</script>

<main class="cv-shell">
  <header class="hero section-block">
    <h1>{profile.name}</h1>
    <p class="header-links">
      <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
      <span>/</span>
      <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
    </p>
  </header>

  <section class="summary-section" aria-label="Professional summary">
    <p>{@html formatSummary(profile.summary)}</p>
  </section>

  <section class="section-block experience-section" aria-labelledby="experience-heading">
    <h2 id="experience-heading">Experience</h2>
    <div class="stacked-cards">
      {#if experience.length === 0}
        <article class="card">
          <p>No experience entries yet.</p>
        </article>
      {:else}
        {#each experience as item}
          <article class="card">
            <div class="card-head">
              <div>
                <h3>{item.role}</h3>
                <p class="company">{item['name-of-company']}</p>
              </div>
              <div class="date-meta">
                <p class="period">{item.date}</p>
                <p class="location">{item.location}</p>
              </div>
            </div>
            <ul>
              {#each item.details as detail}
                <li>{@html formatDetail(detail)}</li>
              {/each}
            </ul>
          </article>
        {/each}
      {/if}
    </div>
  </section>

  <section class="section-block" aria-labelledby="projects-heading">
    <h2 id="projects-heading">Projects</h2>
    <div class="stacked-cards">
      {#if projects.length === 0}
        <article class="card project-card">
          <p>No projects listed yet.</p>
        </article>
      {:else}
        {#each projects as project}
          <article class="card project-card">
            <div class="card-head">
              <div>
                <h3>{project.name}</h3>
                <p class="company">{project.technologies.join(', ')}</p>
              </div>
              <div class="date-meta">
                <p class="period">{project.date}</p>
              </div>
            </div>
            <ul>
              {#each project.details as detail}
                <li>{@html formatDetail(detail)}</li>
              {/each}
            </ul>
          </article>
        {/each}
      {/if}
    </div>
  </section>

  <section class="section-block" aria-labelledby="skills-heading">
    <h2 id="skills-heading">Skills</h2>
    <div class="stacked-cards">
      {#each skillGroups as group}
        <article class="card skill-card">
          <h3>{group.title}</h3>
          <div class="tag-list">
            {#each group.skills as skill}
              <span>{skill}</span>
            {/each}
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="section-block" aria-labelledby="education-heading">
    <h2 id="education-heading">Education</h2>
    <div class="stacked-cards">
      {#each education as item}
        <article class="card education-card">
          <div class="card-head">
            <div>
              <h3>{item.degree}</h3>
              <p class="company">{item.school}</p>
            </div>
            <div class="date-meta">
              <p class="period">{item.date}</p>
              <p class="location">{item.location}</p>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <footer class="section-block footer">
    <nav class="footer-links" aria-label="Footer links">
      <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
      <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      <a href={internalHref}>Internal</a>
    </nav>
    <p>Last updated: {displayLastUpdated}</p>
  </footer>
</main>
