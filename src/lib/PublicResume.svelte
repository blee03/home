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

  let expandedProjectId: string | null = null

  const displayLastUpdated = lastUpdated ?? import.meta.env.VITE_LAST_COMMIT_DATE ?? 'No commits yet'
  const profileLinks = profile as Profile & { linkedin?: string; github?: string }
  const obfuscatedEmail = profile.email?.replace('@', ' [at] ').replaceAll('.', ' [dot] ')
  type LinkKind = 'github' | 'linkedin' | 'email' | 'devpost' | 'news' | 'link'

  const socialLinks = [
    profileLinks.github && { label: 'GitHub', href: profileLinks.github, kind: 'github' as LinkKind },
    profileLinks.linkedin && { label: 'LinkedIn', href: profileLinks.linkedin, kind: 'linkedin' as LinkKind },
  ].filter(Boolean) as Array<{ label: string; href: string; kind: LinkKind }>

  const iconMarkup: Record<LinkKind, string> = {
    github:
      '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 .6a7.4 7.4 0 0 0-2.34 14.42c.37.07.5-.16.5-.35v-1.24c-2.05.45-2.48-.98-2.48-.98-.34-.87-.84-1.1-.84-1.1-.69-.47.05-.46.05-.46.76.05 1.16.78 1.16.78.67 1.15 1.76.82 2.19.63.07-.48.27-.82.49-1.01-1.64-.19-3.37-.82-3.37-3.66 0-.81.29-1.47.77-1.99-.08-.19-.33-.96.07-2 0 0 .63-.2 2.06.77a7.1 7.1 0 0 1 3.75 0c1.43-.97 2.06-.77 2.06-.77.4 1.04.15 1.81.07 2 .48.52.77 1.18.77 1.99 0 2.85-1.73 3.47-3.38 3.66.28.24.53.71.53 1.43v2.13c0 .19.13.42.5.35A7.4 7.4 0 0 0 8 .6Z"/></svg>',
    linkedin:
      '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3.25 5.4H.8v9.2h2.45V5.4Zm-1.22-1.29A1.42 1.42 0 1 0 2 1.24a1.42 1.42 0 0 0 .03 2.87ZM15.2 14.6v-5c0-2.46-1.31-3.6-3.05-3.6-1.4 0-2.03.77-2.38 1.31V5.4H7.31c.03.75 0 9.2 0 9.2h2.46v-5.14c0-.28.02-.56.1-.76.21-.56.68-1.15 1.47-1.15 1.04 0 1.45.79 1.45 1.95v5.1h2.41Z"/></svg>',
    email:
      '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M2.2 3.3h11.6c.66 0 1.2.54 1.2 1.2v7c0 .66-.54 1.2-1.2 1.2H2.2c-.66 0-1.2-.54-1.2-1.2v-7c0-.66.54-1.2 1.2-1.2Zm0 1.2v.15L8 8.35l5.8-3.7V4.5H2.2Zm11.6 7v-4.8L8 10.7 2.2 6.7v4.8h11.6Z"/></svg>',
    devpost:
      '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 2.5h4.8c3.05 0 5.2 1.95 5.2 5s-2.15 5-5.2 5H3v-10Zm2.2 2v6H7.6c1.72 0 2.85-1.05 2.85-3s-1.13-3-2.85-3H5.2Z"/></svg>',
    news:
      '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M2.2 2.4h11.6v9.3c0 .77-.63 1.4-1.4 1.4H3.6c-.77 0-1.4-.63-1.4-1.4V2.4Zm2.1 2.1v1.2h7.4V4.5H4.3Zm0 2.5v1.2h7.4V7H4.3Zm0 2.5v1.2h4.8V9.5H4.3Z"/></svg>',
    link:
      '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6.2 10.8 5 12c-1.4 1.4-3.7 1.4-5.1 0-1.4-1.4-1.4-3.7 0-5.1l1.8-1.8a3.6 3.6 0 0 1 5 0l.6.6-1.1 1.1-.6-.6a2 2 0 0 0-2.8 0L1 7.9a2 2 0 0 0 2.8 2.8l1.2-1.2 1.2 1.3Zm3.6-5.6L11 4c1.4-1.4 3.7-1.4 5.1 0 1.4 1.4 1.4 3.7 0 5.1l-1.8 1.8a3.6 3.6 0 0 1-5 0l-.6-.6 1.1-1.1.6.6a2 2 0 0 0 2.8 0l1.8-1.8a2 2 0 0 0-2.8-2.8L9.8 7.6 8.6 6.5l1.2-1.3Z"/></svg>',
  }

  const renderIcon = (kind: LinkKind) => iconMarkup[kind]

  const getProjectLinkKind = (label: string, href: string): LinkKind => {
    const value = `${label} ${href}`.toLowerCase()
    if (value.includes('github')) return 'github'
    if (value.includes('linkedin')) return 'linkedin'
    if (value.includes('devpost')) return 'devpost'
    if (value.includes('news')) return 'news'
    return 'link'
  }

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

  const toggleProjectExpand = (projectId: string | undefined) => {
    if (!projectId) return
    expandedProjectId = expandedProjectId === projectId ? null : projectId
  }

</script>

<main class="cv-shell">
  <header class="hero section-block">
    <h1>{profile.name}</h1>
    {#if socialLinks.length > 0 || obfuscatedEmail}
      <p class="header-links">
        {#if obfuscatedEmail}
          <span class="header-email">
            <span class="link-icon" aria-hidden="true">{@html renderIcon('email')}</span>
            <span>{obfuscatedEmail}</span>
          </span>
          {#if socialLinks.length > 0}
            <span class="header-separator">/</span>
          {/if}
        {/if}
        {#each socialLinks as link, index}
          <a href={link.href} target="_blank" rel="noreferrer">
            <span class="link-icon" aria-hidden="true">{@html renderIcon(link.kind)}</span>
            <span>{link.label}</span>
          </a>
          {#if index < socialLinks.length - 1}
            <span class="header-separator">/</span>
          {/if}
        {/each}
      </p>
    {/if}
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
                {#if item.companyUrl}
                  <p class="company">
                    <a class="company-link" href={item.companyUrl} target="_blank" rel="noreferrer">
                      <span>{item['name-of-company']}</span>
                    </a>
                  </p>
                {:else}
                  <p class="company">{item['name-of-company']}</p>
                {/if}
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
          <article class="card project-card" class:expanded={expandedProjectId === project.id}>
            <button
              class="project-toggle"
              on:click={() => toggleProjectExpand(project.id)}
              aria-expanded={expandedProjectId === project.id}
              aria-label={`${expandedProjectId === project.id ? 'Collapse' : 'Expand'} ${project.name}`}
            >
              <div class="card-head">
                <div>
                  <h3>{project.name}</h3>
                  <p class="company">{project.technologies.join(', ')}</p>
                </div>
                <div class="date-meta">
                  <p class="period">{project.date}</p>
                  <div class="project-expand-indicator" aria-hidden="true">▼</div>
                </div>
              </div>
              <ul>
                {#each project.details as detail}
                  <li>{@html formatDetail(detail)}</li>
                {/each}
              </ul>
            </button>
            {#if expandedProjectId === project.id}
              <div class="project-expanded">
                {#if project.links && project.links.length > 0}
                  <div class="project-links">
                    {#each project.links as link, index}
                      <a href={link.href} target="_blank" rel="noreferrer">
                        <span class="link-icon" aria-hidden="true">{@html renderIcon(getProjectLinkKind(link.label, link.href))}</span>
                        <span>{link.label}</span>
                      </a>
                      {#if index < project.links.length - 1}
                        <span>/</span>
                      {/if}
                    {/each}
                  </div>
                {:else}
                  <p>More details coming soon...</p>
                {/if}
              </div>
            {/if}
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
    <div class="footer-meta">
      {#if obfuscatedEmail}
        <span class="footer-email">
          <span class="link-icon" aria-hidden="true">{@html renderIcon('email')}</span>
          <span>{obfuscatedEmail}</span>
        </span>
        {#if socialLinks.length > 0}
          <span class="footer-separator">/</span>
        {/if}
      {/if}
      {#if socialLinks.length > 0}
        <nav class="footer-links" aria-label="Footer links">
          {#each socialLinks as link, index}
            <a href={link.href} target="_blank" rel="noreferrer">
              <span class="link-icon" aria-hidden="true">{@html renderIcon(link.kind)}</span>
              <span>{link.label}</span>
            </a>
            {#if index < socialLinks.length - 1}
              <span class="footer-separator">/</span>
            {/if}
          {/each}
        </nav>
      {/if}
    </div>
    <p>Last updated: {displayLastUpdated}</p>
  </footer>
</main>
