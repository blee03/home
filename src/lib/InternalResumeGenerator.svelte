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
  export let homeHref: string = '/home'

  const acronymEntries = Object.entries(acronyms).sort((left, right) => right[0].length - left[0].length)
  const acronymPattern = new RegExp(
    `\\b(${acronymEntries.map(([acronym]) => acronym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'g',
  )

  let selectedExperienceIds = experience.map((item) => item.id)
  let selectedProjectIds = projects.map((item) => item.id)

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

  $: visibleExperience = experience.filter((item) => selectedExperienceIds.includes(item.id))
  $: visibleProjects = projects.filter((item) => selectedProjectIds.includes(item.id))

  const exportPdf = () => window.print()
</script>

<main class="cv-shell">
  <section class="section-block dashboard-shell" aria-labelledby="dashboard-heading">
    <div class="dashboard-header">
      <h2 id="dashboard-heading">Internal Dashboard</h2>
      <a class="button" href={homeHref}>Back to Public Resume</a>
    </div>

    <p class="dashboard-note">
      One-page PDF always includes header information, skillset, and education. Choose which
      experiences and projects to include. Use **double asterisks** in JSON details to emphasize
      keywords.
    </p>

    <div class="grid-two dashboard-grid">
      <div class="card dashboard-controls">
        <h3>Experience in PDF</h3>
        <div class="picker-list">
          {#each experience as item}
            <label>
              <input type="checkbox" bind:group={selectedExperienceIds} value={item.id} />
              <span>
                <strong>{item.role}</strong>
                <small>{item['name-of-company']}</small>
              </span>
            </label>
          {/each}
        </div>

        <h3>Projects in PDF</h3>
        <div class="picker-list">
          {#each projects as item}
            <label>
              <input type="checkbox" bind:group={selectedProjectIds} value={item.id} />
              <span>
                <strong>{item.name}</strong>
                <small>{item.technologies.join(', ')}</small>
              </span>
            </label>
          {/each}
        </div>

        <button class="button solid export-button" on:click={exportPdf}>Export One-Page PDF</button>
      </div>

      <div class="pdf-export">
        <article class="pdf-sheet">
          <header class="pdf-header">
            <h2>{profile.name}</h2>
            <p>{profile.location} | {profile.email} | {profile.website}</p>
          </header>

          <section class="pdf-section">
            <h3>Summary</h3>
            <p>{@html formatSummary(profile.summary)}</p>
          </section>

          <section class="pdf-section">
            <h3>Experience</h3>
            {#if visibleExperience.length === 0}
              <p>Select at least one experience item to include here.</p>
            {:else}
              {#each visibleExperience as item}
                <div class="pdf-item">
                  <p><strong>{item.role}</strong> - {item['name-of-company']}</p>
                  <p class="period">{item.location} | {item.date}</p>
                  <ul>
                    {#each item.details.slice(0, 2) as detail}
                      <li>{@html formatDetail(detail)}</li>
                    {/each}
                  </ul>
                </div>
              {/each}
            {/if}
          </section>

          <section class="pdf-section">
            <h3>Projects</h3>
            {#if visibleProjects.length === 0}
              <p>Select at least one project item to include here.</p>
            {:else}
              {#each visibleProjects as project}
                <div class="pdf-item">
                  <p><strong>{project.name}</strong></p>
                  <p class="company">{project.technologies.join(', ')}</p>
                  <p class="period">{project.date}</p>
                  <ul>
                    {#each project.details.slice(0, 2) as detail}
                      <li>{@html formatDetail(detail)}</li>
                    {/each}
                  </ul>
                </div>
              {/each}
            {/if}
          </section>

          <section class="pdf-section">
            <h3>Skillset</h3>
            <div class="pdf-tags">
              {#each skillGroups as group}
                {#each group.skills as skill}
                  <span>{skill}</span>
                {/each}
              {/each}
            </div>
          </section>

          <section class="pdf-section">
            <h3>Education</h3>
            {#each education as item}
              <p><strong>{item.degree}</strong> - {item.school} ({item.date})</p>
            {/each}
          </section>
        </article>
      </div>
    </div>
  </section>
</main>
