function ProjectCard({ project }) {
  return (
    <article className="card project-card">
      <div className="project-top">
        <div>
          <h3 className="card-title project-title">{project.title}</h3>
          <p className="muted">{project.description}</p>
        </div>
      </div>

      <div className="tag-row" aria-label={`${project.title} tech tags`}>
        {(project.tech ?? []).slice(0, 8).map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>

      <div className="project-links">
        {project.github && (
          <a className="text-link" href={project.github} target="_blank" rel="noreferrer">
            View code -{'>'}
          </a>
        )}
        {project.demo && (
          <a className="text-link" href={project.demo} target="_blank" rel="noreferrer">
            Live demo -{'>'}
          </a>
        )}
      </div>
    </article>
  )
}

export default function Projects({ projects }) {
  return (
    <section id="projects" className="section">
      <div className="section-head">
        <p className="kicker">Projects</p>
        <h2 className="section-title">Things I've built (and learned from)</h2>
      </div>

      <div className="project-grid">
        {(projects ?? []).map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </section>
  )
}

