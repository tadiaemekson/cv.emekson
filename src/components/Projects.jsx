import { useEffect, useState } from 'react'
import { FaGithub, FaInfoCircle, FaStar, FaCodeBranch } from 'react-icons/fa'
import ProjectModal from './ProjectModal'

function ProjectCard({ project, onClick }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (project.github) {
      // Extract owner and repo from github URL
      const match = project.github.match(/github\.com\/([^/]+)\/([^/.]+)/)
      if (match) {
        const [, owner, repo] = match
        fetch(`https://api.github.com/repos/${owner}/${repo}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.stargazers_count !== undefined) {
              setStats({
                stars: data.stargazers_count,
                forks: data.forks_count,
                language: data.language,
              })
            }
          })
          .catch(() => {})
      }
    }
  }, [project.github])

  return (
    <article className="card project-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="project-top">
        <div>
          <h3 className="card-title project-title">{project.title}</h3>
          <p className="muted" style={{ fontSize: '14px', marginBottom: '12px' }}>{project.description}</p>
        </div>
      </div>

      {stats && (
        <div className="project-stats" style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '12px', fontWeight: '700', color: 'var(--accent)' }}>
          {stats.stars > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaStar /> {stats.stars}
            </span>
          )}
          {stats.forks > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaCodeBranch /> {stats.forks}
            </span>
          )}
          {stats.language && (
            <span style={{ opacity: 0.7 }}>
              {stats.language}
            </span>
          )}
        </div>
      )}

      <div className="tag-row" aria-label={`${project.title} tech tags`}>
        {(project.tech ?? []).slice(0, 8).map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>

      <div className="project-links" onClick={e => e.stopPropagation()}>
        {project.github && (
          <a className="text-link" href={project.github} target="_blank" rel="noreferrer" style={{ fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <FaGithub /> Source
          </a>
        )}
        <button className="text-link" onClick={onClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <FaInfoCircle /> Details
        </button>
      </div>
    </article>
  )
}

export default function Projects({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <section id="projects" className="section">
      <div className="section-head">
        <p className="kicker">Projects</p>
        <h2 className="section-title">Things I've built (and learned from)</h2>
      </div>

      <div className="project-grid">
        {(projects ?? []).map((p) => (
          <ProjectCard key={p.title} project={p} onClick={() => setSelectedProject(p)} />
        ))}
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  )
}

